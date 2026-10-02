"""
Module 10: Geospatial Hotspot Detection using Scikit-Learn DBSCAN
Applies density-based spatial clustering to latitude and longitude coordinates.
Uses haversine metric on radians with configurable spatial radius (eps_km) and min_samples.
Identifies high-concentration accident clusters without assuming spherical cluster shapes.
"""
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN

def is_valid_mmr_coordinate(lat, lon):
    """
    Validates that a coordinate falls within the Mumbai Metropolitan Region (MMR) land area.
    Rejects: null, NaN, zero, impossible, and obvious offshore/Arabian Sea coordinates.
    MMR bbox: lat 18.85-19.50, lon 72.75-73.25
    """
    try:
        lat = float(lat)
        lon = float(lon)
    except (TypeError, ValueError):
        return False
    if lat == 0.0 or lon == 0.0:
        return False
    if not (18.85 <= lat <= 19.50):
        return False
    if not (72.75 <= lon <= 73.25):
        return False
    # Arabian Sea / offshore exclusions for Mumbai coastline
    if lat < 19.00 and lon < 72.81:
        return False
    if 19.00 <= lat < 19.15 and lon < 72.79:
        return False
    if 19.15 <= lat < 19.30 and lon < 72.77:
        return False
    return True


def detect_accident_hotspots(df, eps_km=0.8, min_samples=8):
    """
    Runs DBSCAN on coordinate points.
    eps_km: spatial radius in kilometers. Converted to radians (kms / 6371.0088).
    min_samples: minimum points to form a dense core cluster.
    Applies MMR geographic validation before clustering to prevent ocean/offshore points.
    """
    df_with_coords = df.dropna(subset=['latitude', 'longitude']).copy()

    # Apply geographic validation — reject offshore/invalid coordinates
    valid_mask = df_with_coords.apply(
        lambda r: is_valid_mmr_coordinate(r['latitude'], r['longitude']), axis=1
    )
    invalid_count = (~valid_mask).sum()
    if invalid_count > 0:
        print(f"    [GeoValidation] Excluded {invalid_count} records with invalid/offshore coordinates before DBSCAN.")

    df_valid = df_with_coords[valid_mask].copy()

    if len(df_valid) == 0:
        return df, pd.DataFrame()

    # Convert coordinates from degrees to radians for haversine metric
    coords_rad = np.radians(df_valid[['latitude', 'longitude']].values)
    kms_per_radian = 6371.0088
    epsilon_rad = eps_km / kms_per_radian

    db = DBSCAN(eps=epsilon_rad, min_samples=min_samples, metric='haversine')
    df_valid['cluster_id'] = db.fit_predict(coords_rad)

    # Merge cluster_ids back to main df
    df['cluster_id'] = -1
    df.loc[df_valid.index, 'cluster_id'] = df_valid['cluster_id']

    # Extract cluster aggregations (excluding noise cluster -1)
    clusters = df_valid[df_valid['cluster_id'] != -1]
    hotspot_records = []

    for cluster_id, grp in clusters.groupby('cluster_id'):
        centroid_lat = float(grp['latitude'].mean())
        centroid_lon = float(grp['longitude'].mean())
        acc_count = len(grp)
        fatalities = int(grp['fatalities'].sum())
        injured = int(grp['injured'].sum())
        
        # Dominant cause and vehicle
        dom_cause = grp['cause'].mode().iloc[0] if not grp['cause'].empty else "Over-Speeding"
        dom_vehicle = grp['vehicle_type'].mode().iloc[0] if not grp['vehicle_type'].empty else "Two-Wheeler / Bike"
        
        # Peak time / hour
        if 'time' in grp.columns:
            peak_hour = grp['time'].apply(lambda x: str(x).split(':')[0] if ':' in str(x) else "18").mode().iloc[0]
            peak_hour_str = f"{peak_hour}:00 - {int(peak_hour)+1:02d}:00"
        else:
            peak_hour_str = "18:00 - 19:00"

        # Determine prominent area name from cluster points
        area_name = grp['area'].mode().iloc[0] if 'area' in grp.columns and not grp['area'].empty else "Mumbai Corridor"
        loc_name = grp['location'].mode().iloc[0] if 'location' in grp.columns and not grp['location'].empty else f"Cluster #{cluster_id} - {area_name}"

        # Explainable Composite Risk Score for the Hotspot
        # 30% density + 30% severity + 20% fatalities + 20% traffic indicator
        density_score = min(100.0, (acc_count / 30.0) * 100.0)
        fatal_ratio = (fatalities / max(1, acc_count)) * 100.0
        severity_score = min(100.0, (grp['severity'].isin(['Fatal', 'Grievous/Major']).mean() * 100.0))
        traffic_score = 75.0 if "Highway" in loc_name or "Expressway" in loc_name else 55.0
        
        composite_risk = (0.30 * density_score) + (0.30 * severity_score) + (0.20 * fatal_ratio) + (0.20 * traffic_score)
        composite_risk = round(min(100.0, max(15.0, composite_risk)), 1)

        # Classification level
        if composite_risk >= 81 or fatalities >= 12 or acc_count >= 50:
            sev_level = "CRITICAL"
        elif composite_risk >= 61 or fatalities >= 6 or acc_count >= 25:
            sev_level = "HIGH"
        elif composite_risk >= 31:
            sev_level = "MEDIUM"
        else:
            sev_level = "LOW"

        hotspot_records.append({
            'hotspot_id': f"HOTSPOT-MUM-{cluster_id+1:03d}",
            'cluster_id': int(cluster_id),
            'name': f"Potential Accident Hotspot: {loc_name}",
            'area': area_name,
            'centroid_lat': round(centroid_lat, 6),
            'centroid_lon': round(centroid_lon, 6),
            'accident_count': acc_count,
            'fatalities': fatalities,
            'injured': injured,
            'severity_level': sev_level,
            'dominant_cause': dom_cause,
            'dominant_vehicle': dom_vehicle,
            'peak_hour': peak_hour_str,
            'risk_score': composite_risk,
            'confidence_score': round(min(0.98, 0.75 + (acc_count / 100.0)), 2)
        })

    hotspots_df = pd.DataFrame(hotspot_records)
    if not hotspots_df.empty:
        hotspots_df = hotspots_df.sort_values(by='risk_score', ascending=False).reset_index(drop=True)
    return df, hotspots_df
