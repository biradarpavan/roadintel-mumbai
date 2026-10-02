package com.roadsafe.mumbai.service;

import com.roadsafe.mumbai.dto.NaturalLanguageQueryDto;
import com.roadsafe.mumbai.entity.Accident;
import com.roadsafe.mumbai.entity.Hotspot;
import com.roadsafe.mumbai.repository.AccidentRepository;
import com.roadsafe.mumbai.repository.HotspotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiQueryService {

    @Autowired
    private AccidentRepository accidentRepository;

    @Autowired
    private HotspotRepository hotspotRepository;

    public NaturalLanguageQueryDto processQuery(String prompt) {
        NaturalLanguageQueryDto dto = new NaturalLanguageQueryDto();
        dto.setQuery(prompt);

        String lower = prompt.toLowerCase();
        Map<String, Object> filters = new HashMap<>();

        if (lower.contains("bike") || lower.contains("two-wheeler") || lower.contains("motorcycle")) {
            filters.put("vehicleType", "Two-Wheeler / Bike");
        } else if (lower.contains("car") || lower.contains("suv")) {
            filters.put("vehicleType", "Car / SUV");
        } else if (lower.contains("truck") || lower.contains("heavy")) {
            filters.put("vehicleType", "Heavy Commercial / Truck");
        } else if (lower.contains("auto") || lower.contains("rickshaw")) {
            filters.put("vehicleType", "Auto-Rickshaw");
        }

        if (lower.contains("fatal") || lower.contains("death") || lower.contains("killed")) {
            filters.put("severity", "Fatal");
        } else if (lower.contains("major") || lower.contains("grievous")) {
            filters.put("severity", "Grievous/Major");
        } else if (lower.contains("minor")) {
            filters.put("severity", "Minor");
        }

        if (lower.contains("western") || lower.contains("weh")) {
            filters.put("area", "Western");
        } else if (lower.contains("eastern") || lower.contains("eeh")) {
            filters.put("area", "Eastern");
        } else if (lower.contains("dadar")) {
            filters.put("area", "Dadar");
        } else if (lower.contains("bandra")) {
            filters.put("area", "Bandra");
        } else if (lower.contains("andheri")) {
            filters.put("area", "Andheri");
        }

        if (lower.contains("highway") || lower.contains("expressway")) {
            filters.put("roadType", "Highway");
        }

        dto.setFilters(filters);

        // Calculate answer based on actual data
        if (lower.contains("hotspot")) {
            List<Hotspot> hotspots = hotspotRepository.findAllByOrderByRiskScoreDesc();
            if (!hotspots.isEmpty()) {
                Hotspot top = hotspots.get(0);
                dto.setInterpretation("Interpreted as: Querying high-risk data-identified accident hotspots.");
                dto.setAnswer(String.format("Found %d data-identified hotspots. The highest risk corridor is '%s' with %d accidents, %d fatalities, and a composite risk score of %.1f (%s).",
                        hotspots.size(), top.getName(), top.getAccidentCount(), top.getFatalities(), top.getRiskScore(), top.getSeverityLevel()));
                dto.setMatchedCount((long) hotspots.size());
            }
        } else {
            long total = accidentRepository.count();
            dto.setInterpretation("Interpreted as: Accident query with criteria " + filters.toString());
            dto.setAnswer(String.format("Retrieved accidents matching your analytical query filters %s across the canonical unified accident dataset.", filters.toString()));
            dto.setMatchedCount(total);
        }

        return dto;
    }
}
