package com.roadsafe.mumbai.dto;

import java.util.Map;

public class NaturalLanguageQueryDto {
    private String query;
    private String interpretation;
    private Map<String, Object> filters;
    private String answer;
    private Long matchedCount;

    public NaturalLanguageQueryDto() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getInterpretation() { return interpretation; }
    public void setInterpretation(String interpretation) { this.interpretation = interpretation; }

    public Map<String, Object> getFilters() { return filters; }
    public void setFilters(Map<String, Object> filters) { this.filters = filters; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public Long getMatchedCount() { return matchedCount; }
    public void setMatchedCount(Long matchedCount) { this.matchedCount = matchedCount; }
}
