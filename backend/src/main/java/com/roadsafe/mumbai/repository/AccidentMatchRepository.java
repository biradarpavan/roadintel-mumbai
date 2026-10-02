package com.roadsafe.mumbai.repository;

import com.roadsafe.mumbai.entity.AccidentMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccidentMatchRepository extends JpaRepository<AccidentMatch, Long> {
    List<AccidentMatch> findAllByOrderByOverallMatchScoreDesc();
    List<AccidentMatch> findByMatchStatus(String matchStatus);
}
