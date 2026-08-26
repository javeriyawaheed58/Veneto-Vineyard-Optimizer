import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_vineyard_data(num_records_per_zone=300):
    np.random.seed(42)  # Consistent results ke liye
    
    zones = ["Zone_A", "Zone_B", "Zone_C", "Zone_D"]
    end_time = datetime.now()
    start_time = end_time - timedelta(days=10)
    
    data = []
    
    for zone in zones:
        timestamps = pd.date_range(start=start_time, end=end_time, periods=num_records_per_zone)
        
        for ts in timestamps:
            # Realistic ranges for a vineyard in Italy
            soil_moisture = round(np.random.uniform(12.0, 48.0), 2)
            soil_temp = round(np.random.uniform(14.0, 32.0), 2)
            air_temp = round(np.random.uniform(16.0, 38.0), 2)
            humidity = round(np.random.uniform(30.0, 85.0), 2)
            wind_speed = round(np.random.uniform(2.0, 25.0), 2)
            
            # Simulate rain forecast (mostly 0, occasional rain)
            rain_forecast = round(np.random.choice([0.0, 0.0, 0.0, np.random.uniform(1.0, 15.0)], p=[0.7, 0.1, 0.1, 0.1]), 2)
            
            data.append({
                "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
                "vineyard_zone_id": zone,
                "soil_moisture_percent": soil_moisture,
                "soil_temperature": soil_temp,
                "air_temperature": air_temp,
                "humidity_percent": humidity,
                "wind_speed": wind_speed,
                "rain_forecast_mm": rain_forecast
            })
            
    df = pd.DataFrame(data)
    
    # Ensure directory exists
    output_dir = "data/raw"
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, "vineyard_telemetry.csv")
    df.to_csv(output_path, index=False)
    print(f"Dataset successfully generated and saved at: {output_path}")
    print(f"Total rows generated: {len(df)}")

if __name__ == "__main__":
    generate_vineyard_data()