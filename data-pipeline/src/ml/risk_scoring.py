"""
Module 6 & 11: Explainable Risk Scoring and Platform Data Quality Scoring
Computes:
1. Analytical Risk Score (0-100) per accident and corridor
2. Platform Data Quality Score (Completeness, Coordinates, Dates, Categories, Reliability)
"""
import pandas as pd
import numpy as np

def calculate_accident_risk_score(row):
    """
    Computes an analytical risk score (0-100):
    30% accident density / exposure proxy
    30% severity weight
    20% fatalities weight
    20% traffic / speed congestion indicator
    """
    # Severity points
    sev = str(row.get('severity', '')).lower()
    if 'fatal' in sev:
        sev_pts = 100.0
    elif 'major' in sev or 'grievous' in sev:
        sev_pts = 75.0
    elif 'minor' in sev:
        sev_pts = 40.0
    else:
        sev_pts = 20.0
        
    # Fatalities points
    fatalities = float(row.get('fatalities', 0))
    fat_pts = min(100.0, fatalities * 60.0)
    
    # Traffic / Speed indicator
    speed = float(row.get('avg_speed_kmph', 35.0))
    cong = str(row.get('congestion_level', 'Medium')).lower()
    cong_pts = 80.0 if cong == 'high' else (55.0 if cong == 'moderate' else 40.0)
    speed_factor = min(1.2, speed / 40.0)
    traffic_pts = min(100.0, cong_pts * speed_factor)
    
    # Density proxy (vehicles involved + road type)
    veh_count = float(row.get('vehicles_involved', 1))
    road = str(row.get('road_type', '')).lower()
    road_pts = 80.0 if 'expressway' in road or 'highway' in road else 50.0
    density_pts = min(100.0, (veh_count * 20.0) + (road_pts * 0.5))
    
    score = (0.30 * density_pts) + (0.30 * sev_pts) + (0.20 * fat_pts) + (0.20 * traffic_pts)
    return round(min(100.0, max(10.0, score)), 1)

def evaluate_data_quality(df):
    """
    Calculates Platform Data Quality Score:
    - Completeness %
    - Valid Coordinates %
    - Valid Dates %
    - Category Consistency %
    - Overall Quality %
    """
    total = len(df)
    if total == 0:
        return {"overall": 0.0, "completeness": 0.0, "valid_coords": 0.0, "valid_dates": 0.0, "category_consistency": 0.0}

    # Completeness of core fields
    core_cols = ['accident_id', 'date', 'time', 'city', 'latitude', 'longitude', 'severity', 'vehicle_type', 'cause']
    completeness_ratios = [1.0 - (df[c].isna().mean()) for c in core_cols if c in df.columns]
    completeness = round(float(np.mean(completeness_ratios)) * 100.0, 1)

    # Valid coordinates (Mumbai / Maharashtra region)
    valid_coords = round(float(
        ((df['latitude'].between(18.5, 20.5)) & (df['longitude'].between(72.5, 74.0))).mean()
    ) * 100.0, 1)

    # Valid dates
    valid_dates = round(float((df['date'].str.match(r'^\d{4}-\d{2}-\d{2}$', na=False)).mean()) * 100.0, 1)

    # Category consistency
    valid_sev = df['severity'].isin(['Fatal', 'Grievous/Major', 'Minor', 'Non-Injury']).mean()
    valid_veh = df['vehicle_type'].notna().mean()
    category_consistency = round(float((valid_sev + valid_veh) / 2.0) * 100.0, 1)

    # Overall score
    overall = round((0.30 * completeness) + (0.25 * valid_coords) + (0.25 * valid_dates) + (0.20 * category_consistency), 1)

    return {
        "completeness": completeness,
        "valid_coords": valid_coords,
        "valid_dates": valid_dates,
        "category_consistency": category_consistency,
        "overall_quality": overall
    }
