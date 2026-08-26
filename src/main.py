import os
import json
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Import custom modules using absolute paths
from src.database import VineyardDatabaseHandler
from src.decision_engine import VineyardDecisionEngine

app = FastAPI(
    title="Vineyard AI Optimizer API",
    description="Production-grade backend for precision viticulture telemetry, automated irrigation decisions, and offline-first fallback logic.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration from environment variables
STORAGE_PATH = os.getenv("TELEMETRY_STORAGE_PATH", "data/processed/telemetry_storage.csv")
FALLBACK_PATH = os.getenv("FALLBACK_DATASET_PATH", "data/processed/vineyard_processed.csv")

db = VineyardDatabaseHandler(storage_path=STORAGE_PATH)
engine = VineyardDecisionEngine()

@app.get("/", tags=["System Health"])
def root_health_check():
    return {
        "status": "online",
        "system": "Vineyard AI Optimizer Backend",
        "environment": "Development",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/api/telemetry/latest", tags=["Telemetry"])
def get_latest_telemetry():
    """
    Step 6.2: Endpoint for retrieving latest sensor data across all zones.
    """
    try:
        records = db.get_latest_telemetry()
        if not records:
            return {"status": "warning", "message": "No telemetry data found. Run iot_simulator.py or generate_data.py.", "data": []}
        return {"status": "success", "count": len(records), "data": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations", tags=["Decision Engine & AI"])
def get_irrigation_recommendations():
    """
    Step 6.2 & 6.3: Endpoint for ML/Rule-based recommendations with Offline-First Fallback mechanism.
    """
    try:
        records = db.get_latest_telemetry()
        
        # Step 6.3: Offline-First Fallback Mechanism
        if not records:
            if os.path.exists(FALLBACK_PATH):
                df = pd.read_csv(FALLBACK_PATH)
                latest_df = df.sort_values("timestamp").groupby("vineyard_zone_id").tail(1)
                records = latest_df.to_dict(orient="records")
                for r in records:
                    r["data_source"] = "OFFLINE_CACHED_FALLBACK"
            else:
                raise HTTPException(status_code=404, detail="No telemetry or fallback cache available.")
                
        ranked_results = engine.rank_zones(records)
        return {
            "status": "success",
            "mode": "LIVE_MQTT_AND_OFFLINE_FALLBACK_READY",
            "evaluations": ranked_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
  import uvicorn

  host = os.getenv("HOST", "127.0.0.1")
  port = int(os.getenv("PORT", 8000))
  uvicorn.run("src.main:app", host=host, port=port, reload=True)