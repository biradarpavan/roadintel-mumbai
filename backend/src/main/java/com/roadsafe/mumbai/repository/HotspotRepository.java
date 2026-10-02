package com.roadsafe.mumbai.repository;

import com.roadsafe.mumbai.entity.Hotspot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotspotRepository extends JpaRepository<Hotspot, Long> {
    Optional<Hotspot> findByHotspotId(String hotspotId);
    List<Hotspot> findAllByOrderByRiskScoreDesc();
}
