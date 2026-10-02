package com.roadsafe.mumbai.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "accident_matches")
public class AccidentMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "record_id_a", nullable = false, length = 100)
    @JsonProperty("record_id_a")
    @JsonAlias({"record_id_a", "recordIdA"})
    private String recordIdA;

    @Column(name = "record_id_b", nullable = false, length = 100)
    @JsonProperty("record_id_b")
    @JsonAlias({"record_id_b", "recordIdB"})
    private String recordIdB;

    @Column(name = "source_a", length = 100)
    @JsonProperty("source_a")
    @JsonAlias({"source_a", "sourceA"})
    private String sourceA;

    @Column(name = "source_b", length = 100)
    @JsonProperty("source_b")
    @JsonAlias({"source_b", "sourceB"})
    private String sourceB;

    @Column(name = "overall_match_score", nullable = false)
    @JsonProperty("overall_match_score")
    @JsonAlias({"overall_match_score", "overallMatchScore"})
    private Double overallMatchScore;

    @Column(name = "date_similarity")
    @JsonProperty("date_similarity")
    @JsonAlias({"date_similarity", "dateSimilarity"})
    private Double dateSimilarity;

    @Column(name = "location_similarity")
    @JsonProperty("location_similarity")
    @JsonAlias({"location_similarity", "locationSimilarity"})
    private Double locationSimilarity;

    @Column(name = "city_similarity")
    @JsonProperty("city_similarity")
    @JsonAlias({"city_similarity", "citySimilarity"})
    private Double citySimilarity;

    @Column(name = "vehicle_similarity")
    @JsonProperty("vehicle_similarity")
    @JsonAlias({"vehicle_similarity", "vehicleSimilarity"})
    private Double vehicleSimilarity;

    @Column(name = "fatality_similarity")
    @JsonProperty("fatality_similarity")
    @JsonAlias({"fatality_similarity", "fatalitySimilarity"})
    private Double fatalitySimilarity;

    @Column(name = "geo_distance_meters")
    @JsonProperty("geo_distance_meters")
    @JsonAlias({"geo_distance_meters", "geoDistanceMeters"})
    private Double geoDistanceMeters;

    @Column(name = "match_status", nullable = false, length = 50)
    @JsonProperty("match_status")
    @JsonAlias({"match_status", "matchStatus"})
    private String matchStatus; // HIGH_CONFIDENCE_MATCH, POSSIBLE_MATCH

    @Column(name = "review_status", length = 50)
    @JsonProperty("review_status")
    @JsonAlias({"review_status", "reviewStatus"})
    private String reviewStatus = "PENDING_REVIEW"; // CONFIRMED_DUPLICATE, FALSE_POSITIVE, PENDING_REVIEW

    public AccidentMatch() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecordIdA() { return recordIdA; }
    public void setRecordIdA(String recordIdA) { this.recordIdA = recordIdA; }

    public String getRecordIdB() { return recordIdB; }
    public void setRecordIdB(String recordIdB) { this.recordIdB = recordIdB; }

    public String getSourceA() { return sourceA; }
    public void setSourceA(String sourceA) { this.sourceA = sourceA; }

    public String getSourceB() { return sourceB; }
    public void setSourceB(String sourceB) { this.sourceB = sourceB; }

    public Double getOverallMatchScore() { return overallMatchScore; }
    public void setOverallMatchScore(Double overallMatchScore) { this.overallMatchScore = overallMatchScore; }

    public Double getDateSimilarity() { return dateSimilarity; }
    public void setDateSimilarity(Double dateSimilarity) { this.dateSimilarity = dateSimilarity; }

    public Double getLocationSimilarity() { return locationSimilarity; }
    public void setLocationSimilarity(Double locationSimilarity) { this.locationSimilarity = locationSimilarity; }

    public Double getCitySimilarity() { return citySimilarity; }
    public void setCitySimilarity(Double citySimilarity) { this.citySimilarity = citySimilarity; }

    public Double getVehicleSimilarity() { return vehicleSimilarity; }
    public void setVehicleSimilarity(Double vehicleSimilarity) { this.vehicleSimilarity = vehicleSimilarity; }

    public Double getFatalitySimilarity() { return fatalitySimilarity; }
    public void setFatalitySimilarity(Double fatalitySimilarity) { this.fatalitySimilarity = fatalitySimilarity; }

    public Double getGeoDistanceMeters() { return geoDistanceMeters; }
    public void setGeoDistanceMeters(Double geoDistanceMeters) { this.geoDistanceMeters = geoDistanceMeters; }

    public String getMatchStatus() { return matchStatus; }
    public void setMatchStatus(String matchStatus) { this.matchStatus = matchStatus; }

    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }
}
