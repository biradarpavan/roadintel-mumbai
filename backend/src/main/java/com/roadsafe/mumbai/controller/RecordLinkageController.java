package com.roadsafe.mumbai.controller;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.entity.AccidentMatch;
import com.roadsafe.mumbai.service.RecordLinkageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class RecordLinkageController {

    @Autowired
    private RecordLinkageService recordLinkageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccidentMatch>>> getAllMatches() {
        return ResponseEntity.ok(new ApiResponse<>(recordLinkageService.getAllMatches()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccidentMatch>> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(recordLinkageService.getMatchById(id)));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<AccidentMatch>> updateReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.getOrDefault("status", "CONFIRMED_DUPLICATE");
        AccidentMatch updated = recordLinkageService.updateReviewStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(updated));
    }
}
