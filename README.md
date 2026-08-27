# 🍇 Veneto Vineyard AI Optimizer

Real-time vineyard telemetry monitoring and automated precision irrigation control platform.

![Status](https://img.shields.io/badge/status-Production-brightgreen)
![Version](https://img.shields.io/badge/version-v2.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

Veneto Vineyard AI Optimizer bridges IoT telemetry ingestion with an automated FastAPI decision engine and a responsive React dashboard — enabling continuous monitoring, offline edge resilience, and optimized water conservation across vineyard sectors.

## ✨ Key Features

- 🔹 Real-time soil moisture, temperature & humidity monitoring across 4 vineyard blocks
- 🔹 Rule-based AI Agronomist Decision Engine (IRRIGATE / WARNING / MONITOR)
- 🔹 What-If Simulator Sandbox for safe scenario testing
- 🔹 Water Intelligence Analytics — live savings & efficiency ratio tracking
- 🔹 Offline-first edge synchronization for uninterrupted field operations
- 🔹 Dynamic alerts center with real-time severity-based logging

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Lucide Icons
**Backend:** FastAPI (Python), Pydantic
**Database:** SQLite (`agro_mind.db`)
**DevOps:** Docker, Docker Compose

## 📐 Architecture

[Client / React Dashboard]
↓ (HTTP / Polling)
[FastAPI Backend / REST API]
↓
[SQLite Database]
↑
[AI / Decision Engine]


## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ & Node.js 18+ (for local, non-Docker runs)

### Installation
```bash
git clone <repo-url>
cd veneto-vineyard-ai-optimizer
docker compose up --build
```

App will be running at:
- Frontend: `http://localhost:5173`
- Backend/API docs: `http://localhost:8000/docs`

## 📊 Modules

| Module | Route | Description |
|---|---|---|
| Dashboard Overview | `/` | High-level system & sector health summary |
| Vineyard Sector Topology | `/vineyard` | Live per-block telemetry & valve control |
| AI Command Center | `/ai` | Agronomist diagnostics & recommendations |
| What-If Simulator | `/ai/simulator` | Sandbox scenario testing |
| Water Intelligence Analytics | `/analytics/water` | Consumption & efficiency tracking |
| Alerts Center | `/alerts` | Real-time system alerts & logs |

## 🔑 Environment Variables

```env
PORT=8000
VITE_API_BASE_URL=http://localhost:8000
```

## 📄 License

MIT License

## 👤 Author

**Javeriya Waheed** 
