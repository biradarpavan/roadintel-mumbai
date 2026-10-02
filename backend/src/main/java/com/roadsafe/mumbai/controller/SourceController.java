package com.roadsafe.mumbai.controller;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.entity.DataSourceEntity;
import com.roadsafe.mumbai.repository.DataSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sources")
public class SourceController {

    @Autowired
    private DataSourceRepository dataSourceRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DataSourceEntity>>> getSources() {
        return ResponseEntity.ok(new ApiResponse<>(dataSourceRepository.findAll()));
    }
}
