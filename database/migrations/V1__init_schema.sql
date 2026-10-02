-- Flyway Migration V1: Initial Schema for RoadSafe Mumbai
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    year VARCHAR(50),
    url TEXT,
    record_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'LOADED',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accidents (
    id SERIAL PRIMARY KEY,
    accident_id VARCHAR(100) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
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
    vehicle_type VARCHAR(100),
    road_type VARCHAR(100),
    severity VARCHAR(50),
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
    match_status VARCHAR(50) DEFAULT 'UNIQUE',
    matched_record_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    match_status VARCHAR(50) NOT NULL,
    review_status VARCHAR(50) DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotspots (
    id SERIAL PRIMARY KEY,
    hotspot_id VARCHAR(100) UNIQUE NOT NULL,
    cluster_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    area VARCHAR(150),
    centroid_lat DOUBLE PRECISION NOT NULL,
    centroid_lon DOUBLE PRECISION NOT NULL,
    accident_count INT NOT NULL,
    fatalities INT DEFAULT 0,
    injured INT DEFAULT 0,
    severity_level VARCHAR(50) NOT NULL,
    dominant_cause VARCHAR(255),
    dominant_vehicle VARCHAR(100),
    peak_hour VARCHAR(50),
    risk_score DOUBLE PRECISION NOT NULL,
    confidence_score DOUBLE PRECISION DEFAULT 0.90,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_scores (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    accident_density_score DOUBLE PRECISION,
    severity_score DOUBLE PRECISION,
    fatality_score DOUBLE PRECISION,
    traffic_congestion_score DOUBLE PRECISION,
    composite_risk_score DOUBLE PRECISION NOT NULL,
    risk_category VARCHAR(50) NOT NULL,
    methodology_notes TEXT,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
