package com.roadsafe.mumbai.controller;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.dto.DashboardSummaryDto;
import com.roadsafe.mumbai.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getSummary() {
        DashboardSummaryDto summary = analyticsService.getDashboardSummary();
        return ResponseEntity.ok(new ApiResponse<>(summary));
    }
}
