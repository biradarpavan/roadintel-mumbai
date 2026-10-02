"""
Module 3: Data Cleaning Pipeline for RoadSafe Mumbai
Handles missing values, whitespace, casing, date normalization, coordinates, and categories.
"""
import re
import pandas as pd
import numpy as np

def clean_text(val):
    if pd.isna(val) or val is None:
        return None
    val_str = str(val).strip()
    return re.sub(r'\s+', ' ', val_str)

def normalize_city(city_val):
    if pd.isna(city_val) or city_val is None:
        return "Mumbai"
    c = str(city_val).strip().title()
    if "Mumbai" in c or "Bombay" in c:
        return "Mumbai"
    if "Pune" in c:
        return "Pune"
    if "Thane" in c:
        return "Thane"
    if "Nagpur" in c:
        return "Nagpur"
    if "Nashik" in c:
        return "Nashik"
    return c

def normalize_date(date_val):
    """Normalizes dates from various formats (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY) to YYYY-MM-DD."""
    if pd.isna(date_val) or date_val is None:
        return None
    try:
        dt = pd.to_datetime(str(date_val).strip(), errors='coerce', dayfirst=True)
        if pd.isna(dt):
            return None
        return dt.strftime('%Y-%m-%d')
    except Exception:
        return None

def normalize_severity(sev_val):
    if pd.isna(sev_val) or sev_val is None:
        return "Minor"
    s = str(sev_val).strip().lower()
    if any(k in s for k in ['fatal', 'death', 'killed', 'die']):
        return "Fatal"
    if any(k in s for k in ['major', 'grievous', 'severe', 'critical']):
        return "Grievous/Major"
    if any(k in s for k in ['minor', 'slight', 'simple']):
        return "Minor"
    return "Non-Injury"

def normalize_vehicle(veh_val):
    if pd.isna(veh_val) or veh_val is None:
        return "Two-Wheeler / Bike"
    v = str(veh_val).strip().title()
    if any(k in v.lower() for k in ['bike', 'two', 'motorcycle', 'scooter']):
        return "Two-Wheeler / Bike"
    if any(k in v.lower() for k in ['auto', 'rickshaw', 'three']):
        return "Auto-Rickshaw"
    if any(k in v.lower() for k in ['car', 'suv', 'taxi', 'cab', 'sedan']):
        return "Car / SUV"
    if any(k in v.lower() for k in ['bus', 'mini-bus']):
        return "Bus"
    if any(k in v.lower() for k in ['truck', 'lorry', 'heavy', 'trailer']):
        return "Heavy Commercial / Truck"
    return v

def clean_accident_dataframe(df):
    """Applies comprehensive cleaning to raw accident records."""
    cleaned = df.copy()
    
    # Text cleaning
    for col in cleaned.select_dtypes(include='object').columns:
        cleaned[col] = cleaned[col].apply(clean_text)

    # City normalization
    if 'city' in cleaned.columns:
        cleaned['city'] = cleaned['city'].apply(normalize_city)

    # Date normalization
    if 'date' in cleaned.columns:
        cleaned['date'] = cleaned['date'].apply(normalize_date)
        
    # Severity normalization
    if 'accident_severity' in cleaned.columns:
        cleaned['severity'] = cleaned['accident_severity'].apply(normalize_severity)
    elif 'severity' in cleaned.columns:
        cleaned['severity'] = cleaned['severity'].apply(normalize_severity)

    # Coordinate validation (filter out absurd coordinates if necessary)
    if 'latitude' in cleaned.columns and 'longitude' in cleaned.columns:
        cleaned['latitude'] = pd.to_numeric(cleaned['latitude'], errors='coerce')
        cleaned['longitude'] = pd.to_numeric(cleaned['longitude'], errors='coerce')

    return cleaned

def clean_traffic_dataframe(df):
    """Applies cleaning to raw Maharashtra traffic records."""
    cleaned = df.copy()
    for col in cleaned.select_dtypes(include='object').columns:
        cleaned[col] = cleaned[col].apply(clean_text)
    if 'City' in cleaned.columns:
        cleaned['City'] = cleaned['City'].apply(normalize_city)
    if 'Date' in cleaned.columns:
        cleaned['Date'] = cleaned['Date'].apply(normalize_date)
    if 'Vehicle_Type' in cleaned.columns:
        cleaned['Vehicle_Type'] = cleaned['Vehicle_Type'].apply(normalize_vehicle)
    return cleaned
