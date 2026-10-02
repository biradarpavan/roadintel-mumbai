package com.roadsafe.mumbai.service;

import com.roadsafe.mumbai.entity.Hotspot;
import com.roadsafe.mumbai.exception.ResourceNotFoundException;
import com.roadsafe.mumbai.repository.HotspotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotspotService {

    @Autowired
    private HotspotRepository hotspotRepository;

    public List<Hotspot> getAllHotspots() {
        return hotspotRepository.findAllByOrderByRiskScoreDesc();
    }

    public Hotspot getHotspotById(String idOrHotspotId) {
        if (idOrHotspotId.matches("\\d+")) {
            long id = Long.parseLong(idOrHotspotId);
            return hotspotRepository.findById(id)
                    .orElseGet(() -> hotspotRepository.findByHotspotId(idOrHotspotId)
                            .orElseThrow(() -> new ResourceNotFoundException("Hotspot not found: " + idOrHotspotId)));
        }
        return hotspotRepository.findByHotspotId(idOrHotspotId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotspot not found: " + idOrHotspotId));
    }
}
