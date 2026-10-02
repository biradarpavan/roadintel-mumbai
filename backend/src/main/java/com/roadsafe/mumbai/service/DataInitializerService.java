package com.roadsafe.mumbai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roadsafe.mumbai.entity.Accident;
import com.roadsafe.mumbai.entity.AccidentMatch;
import com.roadsafe.mumbai.entity.DataSourceEntity;
import com.roadsafe.mumbai.entity.Hotspot;
import com.roadsafe.mumbai.repository.AccidentMatchRepository;
import com.roadsafe.mumbai.repository.AccidentRepository;
import com.roadsafe.mumbai.repository.DataSourceRepository;
import com.roadsafe.mumbai.repository.HotspotRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class DataInitializerService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializerService.class);

    @Autowired
    private AccidentRepository accidentRepository;

    @Autowired
    private HotspotRepository hotspotRepository;

    @Autowired
    private AccidentMatchRepository accidentMatchRepository;

    @Autowired
    private DataSourceRepository dataSourceRepository;

    @Autowired
    private ResourceLoader resourceLoader;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .findAndRegisterModules();

    @Override
    public void run(String... args) {
        log.info("Checking database initialization status...");

        try {
            // 1. Data Sources
            if (dataSourceRepository.count() == 0) {
                Resource res = resourceLoader.getResource("classpath:data/data_sources.json");
                if (res.exists()) {
                    try (InputStream is = res.getInputStream()) {
                        List<DataSourceEntity> sources = objectMapper.readValue(is, new TypeReference<List<DataSourceEntity>>() {});
                        dataSourceRepository.saveAll(sources);
                        log.info("Loaded {} data sources into database.", sources.size());
                    }
                }
            }

            // 2. Hotspots
            if (hotspotRepository.count() == 0) {
                Resource res = resourceLoader.getResource("classpath:data/hotspots.json");
                if (res.exists()) {
                    try (InputStream is = res.getInputStream()) {
                        List<Hotspot> hotspots = objectMapper.readValue(is, new TypeReference<List<Hotspot>>() {});
                        hotspotRepository.saveAll(hotspots);
                        log.info("Loaded {} accident hotspots into database.", hotspots.size());
                    }
                }
            }

            // 3. Matches
            if (accidentMatchRepository.count() == 0) {
                Resource res = resourceLoader.getResource("classpath:data/accident_matches.json");
                if (res.exists()) {
                    try (InputStream is = res.getInputStream()) {
                        List<AccidentMatch> matches = objectMapper.readValue(is, new TypeReference<List<AccidentMatch>>() {});
                        accidentMatchRepository.saveAll(matches);
                        log.info("Loaded {} record linkage match pairs into database.", matches.size());
                    }
                }
            }

            // 4. Accidents
            if (accidentRepository.count() == 0) {
                Resource res = resourceLoader.getResource("classpath:data/unified_accidents.json");
                if (res.exists()) {
                    try (InputStream is = res.getInputStream()) {
                        List<Accident> accidents = objectMapper.readValue(is, new TypeReference<List<Accident>>() {});
                        accidentRepository.saveAll(accidents);
                        log.info("Loaded {} unified accident records into database.", accidents.size());
                    }
                }
            }

            log.info("Database verification complete. Accidents: {}, Hotspots: {}, Matches: {}, Sources: {}",
                    accidentRepository.count(), hotspotRepository.count(),
                    accidentMatchRepository.count(), dataSourceRepository.count());

        } catch (Exception e) {
            log.error("Error during initial data loading: ", e);
        }
    }
}
