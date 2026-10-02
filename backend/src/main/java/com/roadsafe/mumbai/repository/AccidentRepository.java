package com.roadsafe.mumbai.repository;

import com.roadsafe.mumbai.entity.Accident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface AccidentRepository extends JpaRepository<Accident, Long>, JpaSpecificationExecutor<Accident> {

    Optional<Accident> findByAccidentId(String accidentId);

    @Query("SELECT COUNT(a) FROM Accident a")
    long countTotalAccidents();

    @Query("SELECT COALESCE(SUM(a.fatalities), 0) FROM Accident a")
    long sumTotalFatalities();

    @Query("SELECT COALESCE(SUM(a.injured), 0) FROM Accident a")
    long sumTotalInjured();

    @Query("SELECT a.month as month, COUNT(a) as count, COALESCE(SUM(a.fatalities), 0) as fatalities, COALESCE(SUM(a.injured), 0) as injured FROM Accident a GROUP BY a.month ORDER BY a.month")
    List<Map<String, Object>> getMonthlyDistribution();

    @Query("SELECT a.vehicleType as vehicleType, COUNT(a) as count FROM Accident a GROUP BY a.vehicleType ORDER BY count DESC")
    List<Map<String, Object>> getVehicleDistribution();

    @Query("SELECT a.severity as severity, COUNT(a) as count FROM Accident a GROUP BY a.severity ORDER BY count DESC")
    List<Map<String, Object>> getSeverityDistribution();

    @Query("SELECT a.cause as cause, COUNT(a) as count FROM Accident a GROUP BY a.cause ORDER BY count DESC")
    List<Map<String, Object>> getCauseDistribution();

    @Query("SELECT a.roadType as roadType, COUNT(a) as count FROM Accident a GROUP BY a.roadType ORDER BY count DESC")
    List<Map<String, Object>> getRoadTypeDistribution();

    @Query("SELECT SUBSTRING(a.time, 1, 2) as hourStr, COUNT(a) as count FROM Accident a WHERE a.time IS NOT NULL GROUP BY SUBSTRING(a.time, 1, 2) ORDER BY hourStr")
    List<Map<String, Object>> getHourlyDistribution();

    @Query("SELECT a.source as source, COUNT(a) as count FROM Accident a GROUP BY a.source ORDER BY count DESC")
    List<Map<String, Object>> getSourceDistribution();

    @Query("SELECT a FROM Accident a WHERE a.matchStatus <> 'UNIQUE'")
    List<Accident> findPotentialDuplicates();
}
