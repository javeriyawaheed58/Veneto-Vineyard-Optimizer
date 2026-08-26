import pandas as pd
import numpy as np

class VineyardDecisionEngine:
    def __init__(self, flow_rate_per_zone=15.0):
        # flow_rate in liters per minute per zone
        self.flow_rate = flow_rate_per_zone

    def evaluate_zone(self, data: dict) -> dict:
        """
        Evaluates sensor & weather telemetry for a single zone and returns professional recommendations.
        """
        moisture = data.get("soil_moisture_percent", 30.0)
        soil_temp = data.get("soil_temp", 22.0)
        air_temp = data.get("air_temp", 25.0)
        humidity = data.get("humidity", 50.0)
        rain_forecast = data.get("rain_forecast_mm", 0.0)
        
        # 1. Determine Crop Water Stress Index (CWSI) / Stress Level
        if moisture < 20.0:
            stress_level = "Severe Stress"
            alert_level = "CRITICAL"
        elif moisture < 28.0:
            stress_level = "Mild Stress"
            alert_level = "WARNING"
        else:
            stress_level = "Optimal"
            alert_level = "NORMAL"
            
        # Check weather risk override
        if rain_forecast > 5.0:
            alert_level = "WARNING" if alert_level == "NORMAL" else alert_level
            
        # 2. Decision Logic (Action & Water Volume)
        if moisture < 30.0 and rain_forecast < 3.0:
            action = "IRRIGATE"
            # Calculate water volume deficit proportional to moisture drop below 35% target
            deficit = max(0.0, 35.0 - moisture)
            water_volume = round(deficit * 30.0, 2)  # e.g., 30 liters per % deficit
        else:
            action = "SKIP_IRRIGATION"
            water_volume = 0.0
            
        # 3. Mathematically derived duration (minutes)
        duration_mins = round(water_volume / self.flow_rate, 1) if water_volume > 0 else 0.0
        
        # 4. Confidence Score Methodology (Data completeness + Rule agreement)
        # Assuming all 5 primary telemetry fields are present (completeness = 100%)
        completeness_score = 1.0 
        # Rule agreement check (e.g., moisture low + rain low strongly agree on IRRIGATE)
        rule_agreement = 0.95 if (moisture < 30 and rain_forecast == 0) else 0.85
        confidence_score = round((completeness_score * 0.4 + rule_agreement * 0.6) * 100, 1)
        
        # 5. Optimal Irrigation Window
        optimal_window = "04:00 AM - 06:00 AM" if action == "IRRIGATE" else "N/A"
        
        # 6. Reasoning string
        if action == "IRRIGATE":
            reasoning = f"Soil moisture is low at {moisture}% with minimal rain forecast ({rain_forecast}mm). Irrigation recommended."
        else:
            reasoning = f"Soil moisture is adequate ({moisture}%) or rain is expected ({rain_forecast}mm). Irrigation skipped."
            
        # 7. Resource saving metrics vs fixed schedule
        liters_saved = 150.0 if action == "SKIP_IRRIGATION" else 0.0
        cost_saved = round(liters_saved * 0.002, 2) # Estimated cost currency unit per liter
        
        return {
            "action": action,
            "water_volume_liters": water_volume,
            "duration_minutes": duration_mins,
            "confidence_score": confidence_score,
            "reasoning": reasoning,
            "stress_level": stress_level,
            "alert_level": alert_level,
            "optimal_window": optimal_window,
            "data_source": data.get("data_source", "LIVE_SENSOR"),
            "last_synced_at": data.get("timestamp", pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")),
            "liters_saved_vs_fixed_schedule": liters_saved,
            "estimated_cost_saved": cost_saved
        }

    def rank_zones(self, zone_telemetry_list: list) -> list:
        """
        Calculates multi-zone priority ranking when water resources are limited.
        Lower moisture gets higher priority rank (1 = highest priority).
        """
        evaluated = []
        for zone in zone_telemetry_list:
            res = self.evaluate_zone(zone)
            res["vineyard_zone_id"] = zone.get("vineyard_zone_id", "Unknown")
            evaluated.append(res)
            
        # Sort by moisture ascending (driest soil gets highest priority)
        evaluated.sort(key=lambda x: x["water_volume_liters"], reverse=True)
        
        for rank, item in enumerate(evaluated, start=1):
            item["priority_rank"] = rank if item["action"] == "IRRIGATE" else 99
            
        return evaluated

import json

if __name__ == "__main__":
    # Quick test
    engine = VineyardDecisionEngine()
    sample_data = [
        {"vineyard_zone_id": "Zone_A", "soil_moisture_percent": 18.5, "soil_temp": 24.0, "air_temp": 28.0, "humidity": 45.0, "rain_forecast_mm": 0.0},
        {"vineyard_zone_id": "Zone_B", "soil_moisture_percent": 38.0, "soil_temp": 21.0, "air_temp": 26.0, "humidity": 60.0, "rain_forecast_mm": 6.5}
    ]
    results = engine.rank_zones(sample_data)
    
    # Clean and readable JSON formatting
    print(json.dumps(results, indent=4))