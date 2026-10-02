package com.roadsafe.mumbai.service;

import com.roadsafe.mumbai.dto.ApiResponse;
import com.roadsafe.mumbai.dto.MetaDto;
import com.roadsafe.mumbai.entity.Accident;
import com.roadsafe.mumbai.exception.ResourceNotFoundException;
import com.roadsafe.mumbai.repository.AccidentRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AccidentService {

    @Autowired
    private AccidentRepository accidentRepository;

    public ApiResponse<List<Accident>> getAccidents(
            String city,
            String area,
            String dateFrom,
            String dateTo,
            String severity,
            String vehicleType,
            String source,
            String roadType,
            String search,
            int page,
            int size
    ) {
        Specification<Accident> spec = buildSpecification(city, area, dateFrom, dateTo, severity, vehicleType, source, roadType, search);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        Page<Accident> resultPage = accidentRepository.findAll(spec, pageable);

        MetaDto meta = new MetaDto(
                resultPage.getNumber(),
                resultPage.getSize(),
                resultPage.getTotalElements(),
                resultPage.getTotalPages()
        );

        return new ApiResponse<>(resultPage.getContent(), meta);
    }

    public Accident getAccidentById(String idOrAccidentId) {
        if (idOrAccidentId.matches("\\d+")) {
            long id = Long.parseLong(idOrAccidentId);
            return accidentRepository.findById(id)
                    .orElseGet(() -> accidentRepository.findByAccidentId(idOrAccidentId)
                            .orElseThrow(() -> new ResourceNotFoundException("Accident not found: " + idOrAccidentId)));
        }
        return accidentRepository.findByAccidentId(idOrAccidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Accident not found: " + idOrAccidentId));
    }

    public List<Accident> getFilteredList(
            String city,
            String area,
            String dateFrom,
            String dateTo,
            String severity,
            String vehicleType,
            String source,
            String roadType,
            String search
    ) {
        Specification<Accident> spec = buildSpecification(city, area, dateFrom, dateTo, severity, vehicleType, source, roadType, search);
        return accidentRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "date"));
    }

    public String generateCsv(List<Accident> accidents) {
        StringBuilder sb = new StringBuilder();
        sb.append("accident_id,source,date,time,city,area,location,latitude,longitude,vehicle_type,road_type,severity,fatalities,injured,cause,traffic_density,data_quality_score,match_status\n");
        for (Accident a : accidents) {
            sb.append(escape(a.getAccidentId())).append(",")
                    .append(escape(a.getSource())).append(",")
                    .append(a.getDate() != null ? a.getDate().toString() : "").append(",")
                    .append(escape(a.getTime())).append(",")
                    .append(escape(a.getCity())).append(",")
                    .append(escape(a.getArea())).append(",")
                    .append(escape(a.getLocation())).append(",")
                    .append(a.getLatitude() != null ? a.getLatitude() : "").append(",")
                    .append(a.getLongitude() != null ? a.getLongitude() : "").append(",")
                    .append(escape(a.getVehicleType())).append(",")
                    .append(escape(a.getRoadType())).append(",")
                    .append(escape(a.getSeverity())).append(",")
                    .append(a.getFatalities() != null ? a.getFatalities() : 0).append(",")
                    .append(a.getInjured() != null ? a.getInjured() : 0).append(",")
                    .append(escape(a.getCause())).append(",")
                    .append(escape(a.getTrafficDensity())).append(",")
                    .append(a.getDataQualityScore() != null ? a.getDataQualityScore() : 1.0).append(",")
                    .append(escape(a.getMatchStatus())).append("\n");
        }
        return sb.toString();
    }

    private String escape(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }

    private Specification<Accident> buildSpecification(
            String city,
            String area,
            String dateFrom,
            String dateTo,
            String severity,
            String vehicleType,
            String source,
            String roadType,
            String search
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
            }
            if (area != null && !area.trim().isEmpty() && !area.equalsIgnoreCase("all")) {
                predicates.add(cb.like(cb.lower(root.get("area")), "%" + area.trim().toLowerCase() + "%"));
            }
            if (dateFrom != null && !dateFrom.trim().isEmpty()) {
                try {
                    LocalDate d1 = LocalDate.parse(dateFrom.trim());
                    predicates.add(cb.greaterThanOrEqualTo(root.get("date"), d1));
                } catch (Exception ignored) {}
            }
            if (dateTo != null && !dateTo.trim().isEmpty()) {
                try {
                    LocalDate d2 = LocalDate.parse(dateTo.trim());
                    predicates.add(cb.lessThanOrEqualTo(root.get("date"), d2));
                } catch (Exception ignored) {}
            }
            if (severity != null && !severity.trim().isEmpty() && !severity.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(cb.lower(root.get("severity")), severity.trim().toLowerCase()));
            }
            if (vehicleType != null && !vehicleType.trim().isEmpty() && !vehicleType.equalsIgnoreCase("all")) {
                predicates.add(cb.like(cb.lower(root.get("vehicleType")), "%" + vehicleType.trim().toLowerCase() + "%"));
            }
            if (source != null && !source.trim().isEmpty() && !source.equalsIgnoreCase("all")) {
                predicates.add(cb.equal(root.get("source"), source.trim()));
            }
            if (roadType != null && !roadType.trim().isEmpty() && !roadType.equalsIgnoreCase("all")) {
                predicates.add(cb.like(cb.lower(root.get("roadType")), "%" + roadType.trim().toLowerCase() + "%"));
            }
            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                Predicate searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("accidentId")), term),
                        cb.like(cb.lower(root.get("location")), term),
                        cb.like(cb.lower(root.get("area")), term),
                        cb.like(cb.lower(root.get("cause")), term),
                        cb.like(cb.lower(root.get("source")), term)
                );
                predicates.add(searchPredicate);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
