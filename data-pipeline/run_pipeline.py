"""
RoadIntel Mumbai — Master Data Pipeline Runner
Executes: Ingestion -> Cleaning -> Schema Standardization -> Record Linkage ->
Geospatial DBSCAN Hotspot Detection -> Risk Scoring -> Analytics Generation ->
Seed SQL Export -> Backend Resources Sync.
"""
import os
import sys
import json
import time
import uuid
import shutil
import pandas as pd
import numpy as np

# Ensure src modules can be imported
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, "src")
sys.path.append(SRC_DIR)

from cleaning.clean_data import clean_accident_dataframe, clean_traffic_dataframe
from integration.standardize_data import standardize_accident_dataset, standardize_traffic_dataset
from linkage.record_linkage import perform_record_linkage
from ml.hotspot_detection import detect_accident_hotspots
from ml.risk_scoring import calculate_accident_risk_score, evaluate_data_quality
from analytics.analytics import compute_analytics_summary
import data_fetcher

def run_pipeline():
    start_time = time.time()
    run_id = f"RUN-{uuid.uuid4().hex[:8].upper()}"
    print(f"============================================================")
    print(f"  RoadSafe Mumbai Pipeline Execution — Run ID: {run_id}")
    print(f"============================================================")

    # 1. Fetch / verify raw data
    data_fetcher.fetch_datasets()

    # 2. Ingest Raw Datasets
    raw_acc_path = os.path.join(BASE_DIR, "data", "raw", "accidents", "indian_roads_accidents_raw.csv")
    raw_trf_path = os.path.join(BASE_DIR, "data", "raw", "traffic", "maharashtra_traffic_raw.csv")

    print("\n[Step 1/7] Reading Raw Datasets...")
    df_acc_raw = pd.read_csv(raw_acc_path)
    df_trf_raw = pd.read_csv(raw_trf_path)
    print(f" -> Raw Accident Records read: {len(df_acc_raw):,}")
    print(f" -> Raw Traffic Records read: {len(df_trf_raw):,}")

    # 3. Clean Datasets
    print("\n[Step 2/7] Cleaning Datasets (Whitespace, Casing, Dates, Geometry)...")
    df_acc_cleaned = clean_accident_dataframe(df_acc_raw)
    df_trf_cleaned = clean_traffic_dataframe(df_trf_raw)
    
    # Save cleaned
    cleaned_dir = os.path.join(BASE_DIR, "data", "processed", "cleaned")
    os.makedirs(cleaned_dir, exist_ok=True)
    df_acc_cleaned.head(500).to_csv(os.path.join(cleaned_dir, "cleaned_accidents_sample.csv"), index=False)
    print(" -> Data cleaning completed.")

    # 4. Standardize to Canonical Schema
    print("\n[Step 3/7] Standardizing to Unified Canonical Schema...")
    df_acc_std = standardize_accident_dataset(df_acc_cleaned)
    df_trf_std = standardize_traffic_dataset(df_trf_cleaned)
    
    # Combine into unified dataset
    unified_df = pd.concat([df_acc_std, df_trf_std], ignore_index=True)
    print(f" -> Unified Dataset created with {len(unified_df):,} total records.")
    
    # Save standardized
    std_dir = os.path.join(BASE_DIR, "data", "processed", "standardized")
    os.makedirs(std_dir, exist_ok=True)
    unified_df.head(200).to_csv(os.path.join(std_dir, "standardized_sample.csv"), index=False)

    # 5. Record Linkage & Duplicate Detection
    print("\n[Step 4/7] Performing Probabilistic Record Linkage...")
    unified_df, matches_df = perform_record_linkage(unified_df)
    print(f" -> Candidate duplicate pairs identified: {len(matches_df)}")
    high_conf = len(matches_df[matches_df['match_status'] == 'HIGH_CONFIDENCE_MATCH'])
    possible = len(matches_df[matches_df['match_status'] == 'POSSIBLE_MATCH'])
    print(f"    * High-confidence matches (>=0.90): {high_conf}")
    print(f"    * Possible matches requiring review (0.75 - 0.89): {possible}")

    # 6. Geospatial Hotspot Detection (DBSCAN)
    print("\n[Step 5/7] Detecting Geospatial Hotspots with DBSCAN (eps=0.8km, min_samples=8)...")
    unified_df, hotspots_df = detect_accident_hotspots(unified_df, eps_km=0.8, min_samples=8)
    print(f" -> Data-identified accident clusters (hotspots): {len(hotspots_df)}")
    for idx, h in hotspots_df.head(5).iterrows():
        print(f"    - {h['name']} | Accidents: {h['accident_count']} | Risk Score: {h['risk_score']} ({h['severity_level']})")

    # 7. Risk Scoring and Data Quality Scoring
    print("\n[Step 6/7] Computing Composite Risk Scores & Platform Data Quality Score...")
    unified_df['risk_score'] = unified_df.apply(calculate_accident_risk_score, axis=1)
    quality_metrics = evaluate_data_quality(unified_df)
    print(f" -> Platform Data Quality Score: {quality_metrics['overall_quality']}%")
    print(f"    * Completeness: {quality_metrics['completeness']}%")
    print(f"    * Valid Coordinates: {quality_metrics['valid_coords']}%")
    print(f"    * Valid Dates: {quality_metrics['valid_dates']}%")
    print(f"    * Category Consistency: {quality_metrics['category_consistency']}%")

    # 8. Compute Analytics
    print("\n[Step 7/7] Aggregating Analytics...")
    analytics_data = compute_analytics_summary(unified_df, hotspots_df, matches_df)
    analytics_data['quality'] = quality_metrics

    # Define Data Sources Metadata (Module 1)
    data_sources_list = [
        {
            "id": 1,
            "name": "NCRB Accidental Deaths & Suicides in India (ADSI) 2023",
            "provider": "National Crime Records Bureau / Open Government Data (OGD)",
            "sourceType": "OFFICIAL_GOVERNMENT",
            "year": "2023",
            "url": "https://www.data.gov.in/catalog/accidental-deaths-suicides-india-adsi-2023",
            "recordCount": 2840,
            "status": "LOADED",
            "lastUpdated": "2024-08-15"
        },
        {
            "id": 2,
            "name": "Open Maharashtra Traffic Dataset",
            "provider": "Sanjaikumarrsk Open Dataset (GitHub)",
            "sourceType": "THIRD_PARTY_OPEN",
            "year": "2025",
            "url": "https://github.com/sanjaikumarrsk/TRAFFIC-DATASET",
            "recordCount": len(df_trf_raw),
            "status": "LOADED",
            "lastUpdated": "2025-02-10"
        },
        {
            "id": 3,
            "name": "Indian Road Accident Dataset for Spatial Analytics",
            "provider": "Prashantsundar Open Dataset (GitHub)",
            "sourceType": "THIRD_PARTY_OPEN",
            "year": "2022-2025",
            "url": "https://github.com/Prashantsundar/Indian-Road-Accident-Dataset-Analysis-2022-2025-Python---Jupyternotebook",
            "recordCount": len(df_acc_std),
            "status": "LOADED",
            "lastUpdated": "2025-01-20"
        },
        {
            "id": 4,
            "name": "Mumbai Police Public Advisory Checkpoints",
            "provider": "Mumbai Police Traffic Branch (Public Reference)",
            "sourceType": "OFFICIAL_GOVERNMENT",
            "year": "2024",
            "url": "https://mumbaipolice.gov.in/Ps_Ac?ps_id=71",
            "recordCount": 38,
            "status": "REFERENCED",
            "lastUpdated": "2024-11-01"
        }
    ]

    # Save to data/processed/unified/
    unified_dir = os.path.join(BASE_DIR, "data", "processed", "unified")
    os.makedirs(unified_dir, exist_ok=True)
    unified_csv_path = os.path.join(unified_dir, "unified_accidents.csv")
    unified_json_path = os.path.join(unified_dir, "unified_accidents.json")
    hotspots_csv_path = os.path.join(unified_dir, "hotspots.csv")
    matches_csv_path = os.path.join(unified_dir, "accident_matches.csv")
    analytics_json_path = os.path.join(unified_dir, "analytics_summary.json")
    sources_json_path = os.path.join(unified_dir, "data_sources.json")

    unified_df.to_csv(unified_csv_path, index=False)
    unified_df.to_json(unified_json_path, orient='records', indent=2)
    hotspots_df.to_csv(hotspots_csv_path, index=False)
    matches_df.to_csv(matches_csv_path, index=False)
    with open(analytics_json_path, 'w') as f:
        json.dump(analytics_data, f, indent=2)
    with open(sources_json_path, 'w') as f:
        json.dump(data_sources_list, f, indent=2)

    # Sync to backend/src/main/resources/data/ for standalone embedded launch
    backend_data_dir = os.path.join(os.path.dirname(BASE_DIR), "backend", "src", "main", "resources", "data")
    os.makedirs(backend_data_dir, exist_ok=True)
    shutil.copy(unified_json_path, os.path.join(backend_data_dir, "unified_accidents.json"))
    shutil.copy(analytics_json_path, os.path.join(backend_data_dir, "analytics_summary.json"))
    shutil.copy(sources_json_path, os.path.join(backend_data_dir, "data_sources.json"))
    hotspots_df.to_json(os.path.join(backend_data_dir, "hotspots.json"), orient='records', indent=2)
    matches_df.to_json(os.path.join(backend_data_dir, "accident_matches.json"), orient='records', indent=2)

    # Also save to frontend/public/data/ for zero-friction client fallback or quick load
    frontend_data_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public", "data")
    os.makedirs(frontend_data_dir, exist_ok=True)
    shutil.copy(unified_json_path, os.path.join(frontend_data_dir, "unified_accidents.json"))
    shutil.copy(analytics_json_path, os.path.join(frontend_data_dir, "analytics_summary.json"))
    shutil.copy(sources_json_path, os.path.join(frontend_data_dir, "data_sources.json"))
    shutil.copy(os.path.join(backend_data_dir, "hotspots.json"), os.path.join(frontend_data_dir, "hotspots.json"))
    shutil.copy(os.path.join(backend_data_dir, "accident_matches.json"), os.path.join(frontend_data_dir, "accident_matches.json"))

    # Also generate database/seed.sql
    generate_seed_sql(unified_df, hotspots_df, matches_df, data_sources_list)

    elapsed = round(time.time() - start_time, 2)
    print(f"\n============================================================")
    print(f"  Pipeline Succeeded in {elapsed}s!")
    print(f"  Processed {len(unified_df)} Unified Accidents")
    print(f"  Generated {len(hotspots_df)} Spatial Hotspots")
    print(f"  Detected {len(matches_df)} Linked Duplicate Records")
    print(f"  Database Seed & Backend Resources synchronized.")
    print(f"============================================================")

def generate_seed_sql(unified_df, hotspots_df, matches_df, sources_list):
    """Generates PostgreSQL / PostGIS seed SQL script."""
    seed_path = os.path.join(os.path.dirname(BASE_DIR), "database", "seed.sql")
    with open(seed_path, 'w', encoding='utf-8') as f:
        f.write("-- ========================================================\n")
        f.write("-- RoadSafe Mumbai — Seed Data Script\n")
        f.write("-- Generated automatically by Python Data Pipeline\n")
        f.write("-- ========================================================\n\n")

        # 1. Sources
        f.write("-- 1. Data Sources\n")
        for s in sources_list:
            f.write(f"INSERT INTO data_sources (name, provider, source_type, year, url, record_count, status) "
                    f"VALUES ('{s['name']}', '{s['provider']}', '{s['sourceType']}', '{s['year']}', '{s['url']}', {s['recordCount']}, '{s['status']}') "
                    f"ON CONFLICT DO NOTHING;\n")
        f.write("\n")

        # 2. Hotspots
        f.write("-- 2. Hotspots\n")
        for _, h in hotspots_df.iterrows():
            clean_name = str(h['name']).replace("'", "''")
            clean_area = str(h['area']).replace("'", "''")
            clean_cause = str(h['dominant_cause']).replace("'", "''")
            clean_veh = str(h['dominant_vehicle']).replace("'", "''")
            f.write(f"INSERT INTO hotspots (hotspot_id, cluster_id, name, area, centroid_lat, centroid_lon, centroid_geometry, accident_count, fatalities, injured, severity_level, dominant_cause, dominant_vehicle, peak_hour, risk_score, confidence_score) "
                    f"VALUES ('{h['hotspot_id']}', {h['cluster_id']}, '{clean_name}', '{clean_area}', {h['centroid_lat']}, {h['centroid_lon']}, ST_SetSRID(ST_MakePoint({h['centroid_lon']}, {h['centroid_lat']}), 4326), {h['accident_count']}, {h['fatalities']}, {h['injured']}, '{h['severity_level']}', '{clean_cause}', '{clean_veh}', '{h['peak_hour']}', {h['risk_score']}, {h['confidence_score']}) "
                    f"ON CONFLICT (hotspot_id) DO NOTHING;\n")
        f.write("\n")

        # 3. Matches
        f.write("-- 3. Duplicate Matches\n")
        for _, m in matches_df.iterrows():
            f.write(f"INSERT INTO accident_matches (record_id_a, record_id_b, source_a, source_b, overall_match_score, date_similarity, location_similarity, city_similarity, vehicle_similarity, fatality_similarity, geo_distance_meters, match_status, review_status) "
                    f"VALUES ('{m['record_id_a']}', '{m['record_id_b']}', '{m['source_a']}', '{m['source_b']}', {m['overall_match_score']}, {m['date_similarity']}, {m['location_similarity']}, {m['city_similarity']}, {m['vehicle_similarity']}, {m['fatality_similarity']}, {m['geo_distance_meters']}, '{m['match_status']}', '{m['review_status']}');\n")
        f.write("\n")

        # 4. Accidents sample (first 250 for fast seed execution)
        f.write("-- 4. Unified Accidents (Representative Sample for Seed)\n")
        for _, a in unified_df.head(250).iterrows():
            c_loc = str(a['location']).replace("'", "''")
            c_area = str(a['area']).replace("'", "''")
            c_cause = str(a['cause']).replace("'", "''")
            c_veh = str(a['vehicle_type']).replace("'", "''")
            m_id = a.get('matched_record_id')
            m_val = f"'{m_id}'" if (pd.notna(m_id) and m_id) else "null"
            f.write(f"INSERT INTO accidents (accident_id, source, source_record_id, date, time, year, month, day_of_week, city, area, location, latitude, longitude, geometry, vehicle_type, road_type, severity, injured, fatalities, casualties, cause, traffic_density, congestion_level, avg_speed_kmph, weather, visibility, traffic_signal, vehicles_involved, data_quality_score, match_confidence, match_status, matched_record_id) "
                    f"VALUES ('{a['accident_id']}', '{a['source']}', '{a['source_record_id']}', '{a['date']}', '{a['time']}', {a['year']}, {a['month']}, '{a['day_of_week']}', '{a['city']}', '{c_area}', '{c_loc}', {a['latitude']}, {a['longitude']}, ST_SetSRID(ST_MakePoint({a['longitude']}, {a['latitude']}), 4326), '{c_veh}', '{a['road_type']}', '{a['severity']}', {a['injured']}, {a['fatalities']}, {a['casualties']}, '{c_cause}', '{a['traffic_density']}', '{a['congestion_level']}', {a['avg_speed_kmph']}, '{a['weather']}', '{a['visibility']}', {a['traffic_signal']}, {a['vehicles_involved']}, {a['data_quality_score']}, {a['match_confidence']}, '{a['match_status']}', {m_val}) "
                    f"ON CONFLICT (accident_id) DO NOTHING;\n")

    print(f" -> Seed SQL generated at {seed_path}")

if __name__ == "__main__":
    run_pipeline()
