package com.roadsafe.mumbai.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "accidents", indexes = {
    @Index(name = "idx_acc_date", columnList = "date"),
    @Index(name = "idx_acc_city", columnList = "city"),
    @Index(name = "idx_acc_area", columnList = "area"),
    @Index(name = "idx_acc_sev", columnList = "severity"),
    @Index(name = "idx_acc_veh", columnList = "vehicleType"),
    @Index(name = "idx_acc_src", columnList = "source")
})
public class Accident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "accident_id", unique = true, nullable = false, length = 100)
    @JsonProperty("accident_id")
    @JsonAlias({"accident_id", "accidentId"})
    private String accidentId;

    @Column(nullable = false, length = 100)
    private String source;

    @Column(name = "source_record_id", length = 100)
    @JsonProperty("source_record_id")
    @JsonAlias({"source_record_id", "sourceRecordId"})
    private String sourceRecordId;

    private LocalDate date;

    @Column(length = 50)
    private String time;

    @Column(name = "accident_year")
    @JsonProperty("year")
    @JsonAlias({"year", "accident_year", "accidentYear"})
    private Integer year;

    @Column(name = "accident_month")
    @JsonProperty("month")
    @JsonAlias({"month", "accident_month", "accidentMonth"})
    private Integer month;

    @Column(name = "day_of_week", length = 50)
    @JsonProperty("day_of_week")
    @JsonAlias({"day_of_week", "dayOfWeek"})
    private String dayOfWeek;

    @Column(length = 100)
    private String city;

    @Column(length = 150)
    private String area;

    @Column(columnDefinition = "TEXT")
    private String location;

    private Double latitude;
    private Double longitude;

    @Column(name = "vehicle_type", length = 100)
    @JsonProperty("vehicle_type")
    @JsonAlias({"vehicle_type", "vehicleType"})
    private String vehicleType;

    @Column(name = "road_type", length = 100)
    @JsonProperty("road_type")
    @JsonAlias({"road_type", "roadType"})
    private String roadType;

    @Column(length = 50)
    private String severity;

    private Integer injured = 0;
    private Integer fatalities = 0;
    private Integer casualties = 0;

    @Column(length = 255)
    private String cause;

    @Column(name = "traffic_density", length = 50)
    @JsonProperty("traffic_density")
    @JsonAlias({"traffic_density", "trafficDensity"})
    private String trafficDensity;

    @Column(name = "congestion_level", length = 50)
    @JsonProperty("congestion_level")
    @JsonAlias({"congestion_level", "congestionLevel"})
    private String congestionLevel;

    @Column(name = "avg_speed_kmph")
    @JsonProperty("avg_speed_kmph")
    @JsonAlias({"avg_speed_kmph", "avgSpeedKmph"})
    private Double avgSpeedKmph;

    @Column(length = 100)
    private String weather;

    @Column(length = 100)
    private String visibility;

    @Column(name = "traffic_signal")
    @JsonProperty("traffic_signal")
    @JsonAlias({"traffic_signal", "trafficSignal"})
    private Integer trafficSignal = 0;

    @Column(name = "vehicles_involved")
    @JsonProperty("vehicles_involved")
    @JsonAlias({"vehicles_involved", "vehiclesInvolved"})
    private Integer vehiclesInvolved = 1;

    @Column(name = "data_quality_score")
    @JsonProperty("data_quality_score")
    @JsonAlias({"data_quality_score", "dataQualityScore"})
    private Double dataQualityScore = 0.95;

    @Column(name = "match_confidence")
    @JsonProperty("match_confidence")
    @JsonAlias({"match_confidence", "matchConfidence"})
    private Double matchConfidence = 1.0;

    @Column(name = "match_status", length = 50)
    @JsonProperty("match_status")
    @JsonAlias({"match_status", "matchStatus"})
    private String matchStatus = "UNIQUE";

    @Column(name = "matched_record_id", length = 100)
    @JsonProperty("matched_record_id")
    @JsonAlias({"matched_record_id", "matchedRecordId"})
    private String matchedRecordId;

    public Accident() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccidentId() { return accidentId; }
    public void setAccidentId(String accidentId) { this.accidentId = accidentId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getSourceRecordId() { return sourceRecordId; }
    public void setSourceRecordId(String sourceRecordId) { this.sourceRecordId = sourceRecordId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getRoadType() { return roadType; }
    public void setRoadType(String roadType) { this.roadType = roadType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getInjured() { return injured; }
    public void setInjured(Integer injured) { this.injured = injured; }

    public Integer getFatalities() { return fatalities; }
    public void setFatalities(Integer fatalities) { this.fatalities = fatalities; }

    public Integer getCasualties() { return casualties; }
    public void setCasualties(Integer casualties) { this.casualties = casualties; }

    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }

    public String getTrafficDensity() { return trafficDensity; }
    public void setTrafficDensity(String trafficDensity) { this.trafficDensity = trafficDensity; }

    public String getCongestionLevel() { return congestionLevel; }
    public void setCongestionLevel(String congestionLevel) { this.congestionLevel = congestionLevel; }

    public Double getAvgSpeedKmph() { return avgSpeedKmph; }
    public void setAvgSpeedKmph(Double avgSpeedKmph) { this.avgSpeedKmph = avgSpeedKmph; }

    public String getWeather() { return weather; }
    public void setWeather(String weather) { this.weather = weather; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public Integer getTrafficSignal() { return trafficSignal; }
    public void setTrafficSignal(Integer trafficSignal) { this.trafficSignal = trafficSignal; }

    public Integer getVehiclesInvolved() { return vehiclesInvolved; }
    public void setVehiclesInvolved(Integer vehiclesInvolved) { this.vehiclesInvolved = vehiclesInvolved; }

    public Double getDataQualityScore() { return dataQualityScore; }
    public void setDataQualityScore(Double dataQualityScore) { this.dataQualityScore = dataQualityScore; }

    public Double getMatchConfidence() { return matchConfidence; }
    public void setMatchConfidence(Double matchConfidence) { this.matchConfidence = matchConfidence; }

    public String getMatchStatus() { return matchStatus; }
    public void setMatchStatus(String matchStatus) { this.matchStatus = matchStatus; }

    public String getMatchedRecordId() { return matchedRecordId; }
    public void setMatchedRecordId(String matchedRecordId) { this.matchedRecordId = matchedRecordId; }
}
