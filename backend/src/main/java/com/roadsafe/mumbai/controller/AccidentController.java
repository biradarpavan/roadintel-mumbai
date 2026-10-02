package com.roadsafe.mumbai.controller;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.entity.Accident;
import com.roadsafe.mumbai.service.AccidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accidents")
public class AccidentController {

    @Autowired
    private AccidentService accidentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Accident>>> getAccidents(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String roadType,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        ApiResponse<List<Accident>> response = accidentService.getAccidents(
                city, area, dateFrom, dateTo, severity, vehicleType, source, roadType, search, page, size
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Accident>> getAccidentById(@PathVariable String id) {
        Accident accident = accidentService.getAccidentById(id);
        return ResponseEntity.ok(new ApiResponse<>(accident));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String roadType,
            @RequestParam(required = false) String search
    ) {
        List<Accident> filtered = accidentService.getFilteredList(
                city, area, dateFrom, dateTo, severity, vehicleType, source, roadType, search
        );
        String csv = accidentService.generateCsv(filtered);
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"roadsafe_mumbai_accidents.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(bytes);
    }
}
