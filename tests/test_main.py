import sys
import os

# Add root directory to python path dynamically
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_root_health_check():
    """
    Test system health and root endpoint status.
    """
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Vineyard AI Optimizer" in data["system"]

def test_get_latest_telemetry():
    """
    Test telemetry endpoint returns valid structure.
    """
    response = client.get("/api/telemetry/latest")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "data" in data

def test_get_irrigation_recommendations():
    """
    Test decision engine recommendation endpoint with offline fallback support.
    """
    response = client.get("/api/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "evaluations" in data
    assert len(data["evaluations"]) > 0