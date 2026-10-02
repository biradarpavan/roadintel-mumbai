package com.roadsafe.mumbai.controller;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMonthly() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getMonthlyAnalytics()));
    }

    @GetMapping("/vehicle-types")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getVehicles() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getVehicleAnalytics()));
    }

    @GetMapping("/severity")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSeverity() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getSeverityAnalytics()));
    }

    @GetMapping("/causes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCauses() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getCauseAnalytics()));
    }

    @GetMapping("/road-types")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRoadTypes() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getRoadTypeAnalytics()));
    }

    @GetMapping("/hourly")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getHourly() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getHourlyAnalytics()));
    }

    @GetMapping("/sources")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSources() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getSourceAnalytics()));
    }

    @GetMapping("/quality")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuality() {
        return ResponseEntity.ok(new ApiResponse<>(analyticsService.getDataQualityMetrics()));
    }
}
