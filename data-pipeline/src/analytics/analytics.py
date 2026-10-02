"""
Module 9: Accident Analytics Aggregator for RoadSafe Mumbai
Computes statistical breakdowns:
- Overall summary KPIs
- Temporal distributions (Monthly, Hourly, Day of Week)
- Vehicle type distributions
- Cause distributions
- Road type distributions
- Severity distributions
- Data source breakdowns
"""
import pandas as pd
import numpy as np

def compute_analytics_summary(df, hotspots_df=None, matches_df=None):
    """Generates all analytics metrics from the unified accident dataset."""
    total_accidents = len(df)
    total_fatalities = int(df['fatalities'].sum()) if 'fatalities' in df.columns else 0
    total_injured = int(df['injured'].sum()) if 'injured' in df.columns else 0
    total_casualties = int(df['casualties'].sum()) if 'casualties' in df.columns else (total_fatalities + total_injured)
    avg_casualties = round(float(total_casualties / max(1, total_accidents)), 2)
    high_severity_count = int(df['severity'].isin(['Fatal', 'Grievous/Major']).sum()) if 'severity' in df.columns else 0
    
    potential_duplicates = len(matches_df) if matches_df is not None else int((df['match_status'] != 'UNIQUE').sum())
    hotspots_count = len(hotspots_df) if hotspots_df is not None else 0

    # 1. Monthly Trends
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_data = []
    if 'month' in df.columns:
        m_counts = df.groupby('month').agg(
            accidents=('accident_id', 'count'),
            fatalities=('fatalities', 'sum'),
            injured=('injured', 'sum')
        ).reset_index()
        for idx in range(1, 13):
            row = m_counts[m_counts['month'] == idx]
            acc = int(row['accidents'].iloc[0]) if not row.empty else 0
            fat = int(row['fatalities'].iloc[0]) if not row.empty else 0
            inj = int(row['injured'].iloc[0]) if not row.empty else 0
            monthly_data.append({
                "month": month_names[idx - 1],
                "month_num": idx,
                "accidents": acc,
                "fatalities": fat,
                "injured": inj
            })
    
    # 2. Hourly Distribution
    hourly_data = []
    if 'time' in df.columns:
        hours = df['time'].apply(lambda x: int(str(x).split(':')[0]) if ':' in str(x) and str(x).split(':')[0].isdigit() else 12)
        h_counts = hours.value_counts().sort_index()
        for h in range(24):
            hourly_data.append({
                "hour": f"{h:02d}:00",
                "hour_num": h,
                "accidents": int(h_counts.get(h, 0))
            })

    # 3. Vehicle Distribution
    vehicle_data = []
    if 'vehicle_type' in df.columns:
        v_counts = df['vehicle_type'].value_counts()
        for veh, count in v_counts.items():
            vehicle_data.append({"vehicle_type": str(veh), "count": int(count)})

    # 4. Severity Distribution
    severity_data = []
    if 'severity' in df.columns:
        s_counts = df['severity'].value_counts()
        for sev, count in s_counts.items():
            severity_data.append({"severity": str(sev), "count": int(count)})

    # 5. Cause Distribution
    cause_data = []
    if 'cause' in df.columns:
        c_counts = df['cause'].value_counts().head(8)
        for c, count in c_counts.items():
            cause_data.append({"cause": str(c), "count": int(count)})

    # 6. Road Type Distribution
    road_data = []
    if 'road_type' in df.columns:
        r_counts = df['road_type'].value_counts()
        for r, count in r_counts.items():
            road_data.append({"road_type": str(r), "count": int(count)})

    # 7. Sources Breakdown
    source_data = []
    if 'source' in df.columns:
        src_counts = df['source'].value_counts()
        for s, count in src_counts.items():
            source_data.append({"source": str(s), "count": int(count)})

    return {
        "kpi": {
            "totalAccidents": total_accidents,
            "fatalities": total_fatalities,
            "injured": total_injured,
            "casualties": total_casualties,
            "avgCasualties": avg_casualties,
            "highSeverityCount": high_severity_count,
            "hotspots": hotspots_count,
            "potentialDuplicates": potential_duplicates
        },
        "monthly": monthly_data,
        "hourly": hourly_data,
        "vehicles": vehicle_data,
        "severity": severity_data,
        "causes": cause_data,
        "roadTypes": road_data,
        "sources": source_data
    }
