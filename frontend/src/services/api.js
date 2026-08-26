const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchRecommendations() {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`);
    if (!response.ok) {
      throw new Error('Network response failed');
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn("Backend offline. Using local fallback cache.");
    return null;
  }
}

export async function runSimulationApi(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error("Simulation request failed", error);
    return null;
  }
}