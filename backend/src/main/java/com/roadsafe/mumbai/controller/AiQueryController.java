package com.roadsafe.mumbai.controller;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.dto.NaturalLanguageQueryDto;
import com.roadsafe.mumbai.service.AiQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiQueryController {

    @Autowired
    private AiQueryService aiQueryService;

    @PostMapping("/query")
    public ResponseEntity<ApiResponse<NaturalLanguageQueryDto>> query(@RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("query", "");
        NaturalLanguageQueryDto result = aiQueryService.processQuery(prompt);
        return ResponseEntity.ok(new ApiResponse<>(result));
    }

    @GetMapping("/query")
    public ResponseEntity<ApiResponse<NaturalLanguageQueryDto>> queryGet(@RequestParam(name = "q") String q) {
        NaturalLanguageQueryDto result = aiQueryService.processQuery(q);
        return ResponseEntity.ok(new ApiResponse<>(result));
    }
}
