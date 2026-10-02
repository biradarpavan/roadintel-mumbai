package com.roadsafe.mumbai.service;

import com.roadsafe.mumbai.entity.AccidentMatch;
import com.roadsafe.mumbai.exception.ResourceNotFoundException;
import com.roadsafe.mumbai.repository.AccidentMatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordLinkageService {

    @Autowired
    private AccidentMatchRepository accidentMatchRepository;

    public List<AccidentMatch> getAllMatches() {
        return accidentMatchRepository.findAllByOrderByOverallMatchScoreDesc();
    }

    public AccidentMatch getMatchById(Long id) {
        return accidentMatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match record not found with id: " + id));
    }

    public AccidentMatch updateReviewStatus(Long id, String status) {
        AccidentMatch match = getMatchById(id);
        match.setReviewStatus(status);
        return accidentMatchRepository.save(match);
    }
}
