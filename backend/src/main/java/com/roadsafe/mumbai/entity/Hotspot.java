package com.roadsafe.mumbai.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "hotspots")
public class Hotspot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hotspot_id", unique = true, nullable = false, length = 100)
    @JsonProperty("hotspot_id")
    @JsonAlias({"hotspot_id", "hotspotId"})
    private String hotspotId;

    @Column(name = "cluster_id", nullable = false)
    @JsonProperty("cluster_id")
    @JsonAlias({"cluster_id", "clusterId"})
    private Integer clusterId;

    @Column(nullable = false)
    private String name;

    @Column(length = 150)
    private String area;

    @Column(name = "centroid_lat", nullable = false)
    @JsonProperty("centroid_lat")
    @JsonAlias({"centroid_lat", "centroidLat"})
    private Double centroidLat;

    @Column(name = "centroid_lon", nullable = false)
    @JsonProperty("centroid_lon")
    @JsonAlias({"centroid_lon", "centroidLon"})
    private Double centroidLon;

    @Column(name = "accident_count", nullable = false)
    @JsonProperty("accident_count")
    @JsonAlias({"accident_count", "accidentCount"})
    private Integer accidentCount;

    private Integer fatalities = 0;
    private Integer injured = 0;

    @Column(name = "severity_level", nullable = false, length = 50)
    @JsonProperty("severity_level")
    @JsonAlias({"severity_level", "severityLevel"})
    private String severityLevel; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(name = "dominant_cause", length = 255)
    @JsonProperty("dominant_cause")
    @JsonAlias({"dominant_cause", "dominantCause"})
    private String dominantCause;

    @Column(name = "dominant_vehicle", length = 100)
    @JsonProperty("dominant_vehicle")
    @JsonAlias({"dominant_vehicle", "dominantVehicle"})
    private String dominantVehicle;

    @Column(name = "peak_hour", length = 50)
    @JsonProperty("peak_hour")
    @JsonAlias({"peak_hour", "peakHour"})
    private String peakHour;

    @Column(name = "risk_score", nullable = false)
    @JsonProperty("risk_score")
    @JsonAlias({"risk_score", "riskScore"})
    private Double riskScore;

    @Column(name = "confidence_score")
    @JsonProperty("confidence_score")
    @JsonAlias({"confidence_score", "confidenceScore"})
    private Double confidenceScore = 0.90;

    public Hotspot() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHotspotId() { return hotspotId; }
    public void setHotspotId(String hotspotId) { this.hotspotId = hotspotId; }

    public Integer getClusterId() { return clusterId; }
    public void setClusterId(Integer clusterId) { this.clusterId = clusterId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public Double getCentroidLat() { return centroidLat; }
    public void setCentroidLat(Double centroidLat) { this.centroidLat = centroidLat; }

    public Double getCentroidLon() { return centroidLon; }
    public void setCentroidLon(Double centroidLon) { this.centroidLon = centroidLon; }

    public Integer getAccidentCount() { return accidentCount; }
    public void setAccidentCount(Integer accidentCount) { this.accidentCount = accidentCount; }

    public Integer getFatalities() { return fatalities; }
    public void setFatalities(Integer fatalities) { this.fatalities = fatalities; }

    public Integer getInjured() { return injured; }
    public void setInjured(Integer injured) { this.injured = injured; }

    public String getSeverityLevel() { return severityLevel; }
    public void setSeverityLevel(String severityLevel) { this.severityLevel = severityLevel; }

    public String getDominantCause() { return dominantCause; }
    public void setDominantCause(String dominantCause) { this.dominantCause = dominantCause; }

    public String getDominantVehicle() { return dominantVehicle; }
    public void setDominantVehicle(String dominantVehicle) { this.dominantVehicle = dominantVehicle; }

    public String getPeakHour() { return peakHour; }
    public void setPeakHour(String peakHour) { this.peakHour = peakHour; }

    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
}
