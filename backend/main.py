from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import random

app = FastAPI(title="AGRO-MIND AI Backend", version="2.4")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite Database
def init_db():
    conn = sqlite3.connect("agro_mind.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sectors (
            vineyard_zone_id TEXT PRIMARY KEY,
            soil_moisture REAL,
            temperature_c REAL,
            humidity_pct REAL,
            action TEXT,
            water_volume_liters REAL,
            confidence_score INTEGER,
            status_type TEXT,
            updated_at TEXT
        )
    """)
    # Insert default data if table is empty
    cursor.execute("SELECT COUNT(*) FROM sectors")
    if cursor.fetchone()[0] == 0:
        default_zones = [
            ("North Block", 24.5, 33.2, 42, "IRRIGATE", 325, 96, "CRITICAL"),
            ("South Block", 38.2, 31.0, 48, "WARNING", 140, 91, "WARNING"),
            ("East Block", 62.0, 27.5, 63, "MONITOR", 0, 97, "OPTIMAL"),
            ("West Block", 74.5, 26.1, 68, "STABLE", 0, 99, "STABLE"),
        ]
        cursor.executemany("""
            INSERT INTO sectors (vineyard_zone_id, soil_moisture, temperature_c, humidity_pct, action, water_volume_liters, confidence_score, status_type, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, default_zones)
        conn.commit()
    conn.close()

init_db()

# API Endpoint to get all sector recommendations & live telemetry
@app.get("/api/recommendations")
def get_recommendations():
    conn = sqlite3.connect("agro_mind.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM sectors")
    rows = cursor.fetchall()
    
    results = []
    for row in rows:
        zone = dict(row)
        delta = round(random.uniform(-0.4, 0.4), 1)
        new_moisture = max(15.0, min(95.0, round(zone["soil_moisture"] + delta, 1)))
        
        if new_moisture < 30:
            action, volume, status = "IRRIGATE", 320, "CRITICAL"
        elif 30 <= new_moisture < 45:
            action, volume, status = "WARNING", 150, "WARNING"
        elif 45 <= new_moisture < 70:
            action, volume, status = "MONITOR", 0, "OPTIMAL"
        else:
            action, volume, status = "STABLE", 0, "STABLE"
            
        results.append({
            "vineyard_zone_id": zone["vineyard_zone_id"],
            "soil_moisture": new_moisture,
            "soil_moisture_percent": new_moisture,
            "temperature_c": zone["temperature_c"],
            "humidity_pct": zone["humidity_pct"],
            "action": action,
            "water_volume_liters": volume,
            "confidence_score": zone["confidence_score"],
            "status_type": status
        })
    
    conn.close()
    return {"status": "success", "data": results}

# API Endpoint to run simulations
@app.post("/api/simulate")
def run_simulation(payload: dict):
    rain = payload.get("rain", 0)
    moisture = payload.get("moisture", 35)
    temp = payload.get("temp", 28)
    
    is_critical = moisture < 30 or (moisture < 45 and rain < 5)
    action = "IRRIGATE" if is_critical else "MONITOR"
    volume = round((40 - moisture) * 12) if is_critical else 0
    
    return {
        "action": action,
        "volume": max(0, volume),
        "reason": f"AI Decision Engine evaluated soil moisture ({moisture}%), rain ({rain}mm), and temp ({temp}°C) against live rule matrix."
    }