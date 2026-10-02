package com.roadsafe.mumbai.controller;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.entity.Hotspot;
import com.roadsafe.mumbai.service.HotspotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hotspots")
public class HotspotController {

    @Autowired
    private HotspotService hotspotService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hotspot>>> getHotspots() {
        List<Hotspot> hotspots = hotspotService.getAllHotspots();
        return ResponseEntity.ok(new ApiResponse<>(hotspots));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hotspot>> getHotspotById(@PathVariable String id) {
        Hotspot hotspot = hotspotService.getHotspotById(id);
        return ResponseEntity.ok(new ApiResponse<>(hotspot));
    }
}
