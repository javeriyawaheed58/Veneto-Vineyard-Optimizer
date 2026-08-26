import os
import json
import pandas as pd
from datetime import datetime

class VineyardDatabaseHandler:
    def __init__(self, storage_path="data/processed/telemetry_storage.csv"):
        self.storage_path = storage_path
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        
        # Initialize storage file if not exists
        if not os.path.exists(self.storage_path):
            df = pd.DataFrame(columns=[
                "timestamp", "vineyard_zone_id", "soil_moisture_percent", 
                "soil_temperature", "air_temperature", "humidity_percent", 
                "wind_speed", "rain_forecast_mm", "data_source"
            ])
            df.to_csv(self.storage_path, index=False)

    def insert_telemetry(self, payload: dict):
        """
        Ingests incoming sensor telemetry into local storage / time-series simulation sink.
        """
        try:
            df = pd.read_csv(self.storage_path)
            new_row = pd.DataFrame([payload])
            df = pd.concat([df, new_row], ignore_index=True)
            df.to_csv(self.storage_path, index=False)
            print(f"[Database Ingestion] Saved telemetry for {payload.get('vineyard_zone_id')} successfully.")
        except Exception as e:
            print(f"Database Ingestion Error: {e}")

    def get_latest_telemetry(self):
        """
        Retrieves the latest telemetry readings for all zones.
        """
        if not os.path.exists(self.storage_path):
            return []
        df = pd.read_csv(self.storage_path)
        if df.empty:
            return []
        
        # Get latest record per zone
        latest_df = df.sort_values("timestamp").groupby("vineyard_zone_id").tail(1)
        return latest_df.to_dict(orient="records")

if __name__ == "__main__":
    # Quick test of database handler
    db = VineyardDatabaseHandler()
    sample_payload = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "vineyard_zone_id": "Zone_A",
        "soil_moisture_percent": 24.5,
        "soil_temperature": 22.0,
        "air_temperature": 27.0,
        "humidity_percent": 55.0,
        "wind_speed": 5.0,
        "rain_forecast_mm": 0.0,
        "data_source": "LIVE_SENSOR"
    }
    db.insert_telemetry(sample_payload)
    
    # Clean and readable JSON formatting
    latest_records = db.get_latest_telemetry()
    print("\nLatest Records:")
    print(json.dumps(latest_records, indent=4))