# 🚨 RoadSafe Mumbai — Unified Road Accident Intelligence Platform

> **24-Hour Hackathon Project** | Full-Stack Geospatial Intelligence System  
> Built with **React + Vite**, **Spring Boot 3**, **Python ML Pipeline**, and **H2/PostgreSQL**

---

## 🎯 What This Does

RoadSafe Mumbai is a **Unified Road Accident Data Integration & Geospatial Intelligence Platform** that:

1. **Ingests** accident data from multiple heterogeneous sources (different schemas, formats, column names)
2. **Cleans & Standardizes** into a canonical unified schema using Python
3. **Performs Probabilistic Record Linkage** to detect duplicates across sources
4. **Detects Geospatial Hotspots** using DBSCAN clustering (Haversine distance)
5. **Computes Risk Scores** for each hotspot and accident record
6. **Serves REST APIs** via Spring Boot 3 with H2 (embedded, no PostgreSQL needed)
7. **Visualizes** on an interactive Leaflet map + Recharts analytics dashboard

---

## 🚀 QUICK START — Run In 3 Steps

### Prerequisites
- **Python 3.8+** (`python --version`)
- **Java 17+ / 21** (`java -version`) 
- **Maven 3.8+** (`mvn --version`)
- **Node.js 18+** (`node -v`) + npm

---

### Step 1: Run the Data Pipeline

```bash
cd data-pipeline
pip install pandas numpy scikit-learn scipy requests
python run_pipeline.py
```

**What this does:**
- Downloads 2 open datasets from GitHub (21,200 raw records)
- Cleans, standardizes, and unifies into 2,692 Mumbai-focused accident records
- Detects 23 geospatial hotspots via DBSCAN
- Performs probabilistic record linkage (15 duplicate pairs)
- Generates JSON data files and syncs to `backend/` and `frontend/public/data/`

**Expected output:**
```
Pipeline Succeeded in ~15s!
Processed 2692 Unified Accidents
Generated 23 Spatial Hotspots
Detected 15 Linked Duplicate Records
```

---

### Step 2: Start the Spring Boot Backend

```bash
cd backend
mvn spring-boot:run
```

**What this does:**
- Starts on `http://localhost:8080`
- Loads all unified data into H2 in-memory database
- Exposes REST APIs for accidents, hotspots, matches, analytics, AI queries

**Ready when you see:**
```
Started RoadSafeApplication in X.X seconds
Loaded 2692 unified accident records into database.
```

**Available APIs:**
- `GET /api/dashboard/summary` — KPI summary
- `GET /api/accidents?severity=HIGH&area=Andheri&page=0&size=50` — filtered accidents
- `GET /api/hotspots` — all 23 hotspots
- `GET /api/matches` — record linkage pairs
- `GET /api/sources` — data source catalog
- `GET /api/analytics/monthly` — monthly trend data
- `GET /api/analytics/vehicle-types` — vehicle breakdown
- `GET /api/analytics/severity` — severity distribution
- `POST /api/ai/query` — natural language query (body: `{"query": "show me fatal accidents in Andheri"}`)
- `GET /h2-console` — H2 DB browser (connect to `jdbc:h2:mem:roadsafe_mumbai`)

---

### Step 3: Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```

**Open: `http://localhost:5173`**

> **Note:** The frontend has full fallback to local JSON files if the backend is not running. You can run the frontend standalone without the backend.

---

## 📐 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    RoadSafe Mumbai                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  DATA SOURCES                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │
│  │ NCRB ADSI   │ │ Maharashtra │ │ Indian Roads    │   │
│  │ 2023 (OGD)  │ │ Traffic DB  │ │ Accident DB     │   │
│  │ Official    │ │ ~1,200 recs │ │ ~20,000 records │   │
│  └──────┬──────┘ └──────┬──────┘ └────────┬────────┘   │
│         └───────────────┴────────────────-┘             │
│                         ↓                                │
│  PYTHON DATA PIPELINE (data-pipeline/)                   │
│  ┌────────────────────────────────────────────┐          │
│  │ 1. Ingest → 2. Clean → 3. Standardize     │          │
│  │ 4. Record Linkage (probabilistic)          │          │
│  │ 5. DBSCAN Hotspot Detection (eps=0.8km)   │          │
│  │ 6. Risk Scoring → 7. Analytics Export     │          │
│  └─────────────────────┬──────────────────────┘          │
│                        ↓                                 │
│  ┌─────────────────────────────────────────────────┐     │
│  │ SPRING BOOT 3.3 BACKEND (Java 21)              │     │
│  │ H2 In-Memory Database (zero-setup)             │     │
│  │ REST API at :8080                              │     │
│  └────────────────────┬────────────────────────────┘     │
│                       ↓                                  │
│  ┌────────────────────────────────────────────────┐      │
│  │ REACT 19 + VITE FRONTEND                       │      │
│  │ Leaflet Maps | Recharts | Tailwind CSS v4      │      │
│  │ 7 Pages: Dashboard, Map, Hotspots, Linkage,   │      │
│  │          Integration, Analytics, Quality       │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
Mumbai Road_Safety/
├── data-pipeline/               # Python ML pipeline
│   ├── run_pipeline.py          # Master runner (execute this!)
│   ├── requirements.txt         # Python deps
│   ├── src/
│   │   ├── data_fetcher.py      # Downloads datasets
│   │   ├── cleaning/            # Data cleaning modules
│   │   ├── integration/         # Schema standardization
│   │   ├── linkage/             # Record linkage
│   │   ├── ml/                  # DBSCAN + risk scoring
│   │   └── analytics/           # Analytics aggregation
│   └── data/
│       ├── raw/                 # Downloaded raw CSVs
│       └── processed/unified/   # Generated JSON outputs
│
├── backend/                     # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/roadsafe/mumbai/
│       ├── controller/          # REST controllers
│       ├── service/             # Business logic
│       ├── entity/              # JPA entities
│       ├── repository/          # Spring Data repos
│       └── dto/                 # Data transfer objects
│
├── frontend/                    # React + Vite
│   ├── package.json
│   ├── vite.config.js           # Proxy: /api → :8080
│   ├── public/data/             # Offline JSON fallback
│   └── src/
│       ├── components/          # 11 React components
│       └── services/api.js      # Axios + fallback logic
│
└── database/
    ├── schema.sql               # PostgreSQL PostGIS schema
    ├── migrations/              # Flyway migrations
    └── seed.sql                 # Generated seed data
```

---

## 🗺️ Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | KPI cards: total accidents, fatalities, hotspots, data quality score |
| **Geospatial Map** | Leaflet map with accident clusters, heatmap, hotspot markers |
| **Hotspot Analysis** | 23 DBSCAN-detected hotspots with risk scores (CRITICAL/HIGH/MEDIUM/LOW) |
| **Record Linkage** | Probabilistic duplicate detection across data sources with match scores |
| **Data Integration** | Pipeline status, source catalog, schema mapping visualization |
| **Analytics** | Monthly trends, vehicle types, severity distribution, cause analysis |
| **Data Quality** | Completeness, coordinate validity, date validity, consistency scores |
| **AI Assistant** | Natural language query → filter extraction (offline fallback) |

---

## 📊 Data Sources

| # | Source | Provider | Records | Type |
|---|--------|----------|---------|------|
| A | NCRB ADSI 2023 | National Crime Records Bureau / OGD | 2,864 | Official Government |
| B | Mumbai Police Checkpoints | Mumbai Traffic Police | 38 | Official Reference |
| C | Maharashtra Traffic Dataset | Sanjaikumarrsk (GitHub) | 1,200 | Open Dataset |
| D | Indian Roads Accident Dataset | Prashantsundar (GitHub) | 20,000 | Open Dataset |

**Unified Output: 2,692 Mumbai-focused canonical records**

---

## ⚙️ Optional: PostgreSQL + PostGIS Production Mode

If you want to use a real PostgreSQL database instead of H2:

```bash
# Start the backend with postgres profile
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

Make sure `backend/src/main/resources/application-postgres.yml` has correct DB credentials.

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Kill existing Java: `taskkill /IM java.exe /F` or use `mvn spring-boot:run -Dserver.port=9090` |
| Pipeline fails to download | Check internet connection; data files may need VPN |
| Frontend shows "Failed to load" | Run pipeline first, then frontend will use local fallback JSON |
| `mvn` not found | Add Maven to PATH or use `./mvnw spring-boot:run` |

---

## 🏆 Hackathon Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, Leaflet, Recharts, Lucide |
| Backend | Spring Boot 3.3, Java 21, Spring Data JPA, H2 / PostgreSQL |
| ML Pipeline | Python 3, Pandas, NumPy, Scikit-Learn (DBSCAN), SciPy |
| Database | H2 (embedded) / PostgreSQL 15+ with PostGIS |
| Data Sources | NCRB OGD, GitHub open datasets |

---

*Built for Smart Cities Hackathon — Mumbai Road Safety Division*
