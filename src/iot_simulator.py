import time
import json
import random
import paho.mqtt.client as mqtt
from datetime import datetime

# MQTT Broker Configuration (Using public test broker for easy local/offline simulation)
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "veneto/vineyard/zone_telemetry"

def generate_sensor_payload(zone_id):
    """
    Generates mock sensor telemetry payload for a specific vineyard zone.
    """
    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "vineyard_zone_id": zone_id,
        "soil_moisture_percent": round(random.uniform(15.0, 45.0), 2),
        "soil_temperature": round(random.uniform(18.0, 28.0), 2),
        "air_temperature": round(random.uniform(20.0, 35.0), 2),
        "humidity_percent": round(random.uniform(35.0, 80.0), 2),
        "wind_speed": round(random.uniform(2.0, 20.0), 2),
        "rain_forecast_mm": round(random.choice([0.0, 0.0, 2.5, 8.0]), 2),
        "data_source": "LIVE_SENSOR"
    }

def run_iot_simulator():
    print(f"--- Initializing IoT Sensor Simulator ---")
    print(f"Connecting to MQTT Broker: {MQTT_BROKER}:{MQTT_PORT}...")
    
    # Updated for paho-mqtt v2.0+ compatibility
    client = mqtt.Client(client_id="Vineyard_Sensor_Node", callback_api_version=mqtt.CallbackAPIVersion.VERSION1)
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        client.loop_start()
        print("Connected successfully to MQTT Broker!")
        print(f"Publishing telemetry to topic: '{MQTT_TOPIC}'. Press Ctrl+C to stop.\n")
        
        zones = ["Zone_A", "Zone_B", "Zone_C", "Zone_D"]
        
        while True:
            zone = random.choice(zones)
            payload = generate_sensor_payload(zone)
            message = json.dumps(payload)
            
            client.publish(MQTT_TOPIC, message)
            print(f"[MQTT Published] Zone: {zone} | Moisture: {payload['soil_moisture_percent']}% | Rain: {payload['rain_forecast_mm']}mm")
            
            # Wait for 3 seconds before next telemetry broadcast
            time.sleep(3)
            
    except KeyboardInterrupt:
        print("\nIoT Simulator stopped by user.")
        client.loop_stop()
        client.disconnect()
    except Exception as e:
        print(f"MQTT Connection Error: {e}")

if __name__ == "__main__":
    run_iot_simulator()