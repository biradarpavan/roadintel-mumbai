-- ============================================================================
-- RoadSafe Mumbai — Unified Database Schema
-- Compatible with PostgreSQL 15+ with PostGIS extension
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Data Sources Table
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL, -- 'OFFICIAL_GOVERNMENT', 'THIRD_PARTY_OPEN', 'DERIVED_PROCESSED'
    year VARCHAR(50),
    url TEXT,
    record_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'LOADED', -- 'LOADED', 'PROCESSING', 'PENDING'
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Unified Accidents Table
CREATE TABLE IF NOT EXISTS accidents (
    id SERIAL PRIMARY KEY,
    accident_id VARCHAR(100) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL, -- 'NCRB_OGD', 'OPEN_MAHARASHTRA_TRAFFIC', 'OPEN_ACCIDENT_DATASET'
    source_record_id VARCHAR(100),
    date DATE,
    time VARCHAR(50),
    year INT,
    month INT,
    day_of_week VARCHAR(50),
    city VARCHAR(100) DEFAULT 'Mumbai',
    area VARCHAR(150),
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geometry geometry(Point, 4326),
    vehicle_type VARCHAR(100),
    road_type VARCHAR(100),
    severity VARCHAR(50), -- 'Fatal', 'Grievous/Major', 'Minor', 'Non-Injury'
    injured INT DEFAULT 0,
    fatalities INT DEFAULT 0,
    casualties INT DEFAULT 0,
    cause VARCHAR(255),
    traffic_density VARCHAR(50),
    congestion_level VARCHAR(50),
    avg_speed_kmph DOUBLE PRECISION,
    weather VARCHAR(100),
    visibility VARCHAR(100),
    traffic_signal INT DEFAULT 0,
    vehicles_involved INT DEFAULT 1,
    data_quality_score DOUBLE PRECISION,
    match_confidence DOUBLE PRECISION DEFAULT 1.0,
    match_status VARCHAR(50) DEFAULT 'UNIQUE', -- 'UNIQUE', 'HIGH_CONFIDENCE_MATCH', 'POSSIBLE_MATCH'
    matched_record_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Spatial Index and Performance Indexes
CREATE INDEX IF NOT EXISTS idx_accidents_geom ON accidents USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_accidents_date ON accidents (date);
CREATE INDEX IF NOT EXISTS idx_accidents_city ON accidents (city);
CREATE INDEX IF NOT EXISTS idx_accidents_area ON accidents (area);
CREATE INDEX IF NOT EXISTS idx_accidents_severity ON accidents (severity);
CREATE INDEX IF NOT EXISTS idx_accidents_vehicle ON accidents (vehicle_type);
CREATE INDEX IF NOT EXISTS idx_accidents_source ON accidents (source);

-- 3. Accident Matches / Record Linkage Table
CREATE TABLE IF NOT EXISTS accident_matches (
    id SERIAL PRIMARY KEY,
    record_id_a VARCHAR(100) NOT NULL,
    record_id_b VARCHAR(100) NOT NULL,
    source_a VARCHAR(100),
    source_b VARCHAR(100),
    overall_match_score DOUBLE PRECISION NOT NULL,
    date_similarity DOUBLE PRECISION,
    location_similarity DOUBLE PRECISION,
    city_similarity DOUBLE PRECISION,
    vehicle_similarity DOUBLE PRECISION,
    fatality_similarity DOUBLE PRECISION,
    geo_distance_meters DOUBLE PRECISION,
    match_status VARCHAR(50) NOT NULL, -- 'HIGH_CONFIDENCE_MATCH', 'POSSIBLE_MATCH', 'PROBABLY_DIFFERENT'
    review_status VARCHAR(50) DEFAULT 'PENDING_REVIEW', -- 'CONFIRMED_DUPLICATE', 'FALSE_POSITIVE', 'PENDING_REVIEW'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_matches_score ON accident_matches (overall_match_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON accident_matches (match_status);

-- 4. Potential Accident Hotspots (Data-Identified Clusters)
CREATE TABLE IF NOT EXISTS hotspots (
    id SERIAL PRIMARY KEY,
    hotspot_id VARCHAR(100) UNIQUE NOT NULL,
    cluster_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(150),
    centroid_lat DOUBLE PRECISION NOT NULL,
    centroid_lon DOUBLE PRECISION NOT NULL,
    centroid_geometry geometry(Point, 4326),
    accident_count INT NOT NULL,
    fatalities INT DEFAULT 0,
    injured INT DEFAULT 0,
    severity_level VARCHAR(50) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    dominant_cause VARCHAR(255),
    dominant_vehicle VARCHAR(100),
    peak_hour VARCHAR(50),
    risk_score DOUBLE PRECISION NOT NULL,
    confidence_score DOUBLE PRECISION DEFAULT 0.90,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hotspots_geom ON hotspots USING GIST (centroid_geometry);
CREATE INDEX IF NOT EXISTS idx_hotspots_risk ON hotspots (risk_score DESC);

-- 5. Risk Scores Table
CREATE TABLE IF NOT EXISTS risk_scores (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'HOTSPOT', 'ROAD_CORRIDOR', 'WARD'
    entity_name VARCHAR(255) NOT NULL,
    accident_density_score DOUBLE PRECISION,
    severity_score DOUBLE PRECISION,
    fatality_score DOUBLE PRECISION,
    traffic_congestion_score DOUBLE PRECISION,
    composite_risk_score DOUBLE PRECISION NOT NULL,
    risk_category VARCHAR(50) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    methodology_notes TEXT,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Processing Runs Table
CREATE TABLE IF NOT EXISTS processing_runs (
    id SERIAL PRIMARY KEY,
    run_uuid VARCHAR(100) UNIQUE NOT NULL,
    pipeline_version VARCHAR(50) NOT NULL,
    records_ingested INT DEFAULT 0,
    records_cleaned INT DEFAULT 0,
    records_standardized INT DEFAULT 0,
    duplicates_detected INT DEFAULT 0,
    hotspots_generated INT DEFAULT 0,
    overall_quality_score DOUBLE PRECISION DEFAULT 0.0,
    execution_time_seconds DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'SUCCESS',
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
