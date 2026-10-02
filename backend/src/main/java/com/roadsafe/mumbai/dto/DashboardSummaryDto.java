package com.roadsafe.mumbai.dto;

public class DashboardSummaryDto {
    private long totalAccidents;
    private long fatalities;
    private long injured;
    private long casualties;
    private double avgCasualties;
    private long hotspots;
    private long potentialDuplicates;
    private double dataQualityScore;
    private long highSeverityCount;
    private long sourcesCount;

    public DashboardSummaryDto() {}

    public long getTotalAccidents() { return totalAccidents; }
    public void setTotalAccidents(long totalAccidents) { this.totalAccidents = totalAccidents; }

    public long getFatalities() { return fatalities; }
    public void setFatalities(long fatalities) { this.fatalities = fatalities; }

    public long getInjured() { return injured; }
    public void setInjured(long injured) { this.injured = injured; }

    public long getCasualties() { return casualties; }
    public void setCasualties(long casualties) { this.casualties = casualties; }

    public double getAvgCasualties() { return avgCasualties; }
    public void setAvgCasualties(double avgCasualties) { this.avgCasualties = avgCasualties; }

    public long getHotspots() { return hotspots; }
    public void setHotspots(long hotspots) { this.hotspots = hotspots; }

    public long getPotentialDuplicates() { return potentialDuplicates; }
    public void setPotentialDuplicates(long potentialDuplicates) { this.potentialDuplicates = potentialDuplicates; }

    public double getDataQualityScore() { return dataQualityScore; }
    public void setDataQualityScore(double dataQualityScore) { this.dataQualityScore = dataQualityScore; }

    public long getHighSeverityCount() { return highSeverityCount; }
    public void setHighSeverityCount(long highSeverityCount) { this.highSeverityCount = highSeverityCount; }

    public long getSourcesCount() { return sourcesCount; }
    public void setSourcesCount(long sourcesCount) { this.sourcesCount = sourcesCount; }
}
