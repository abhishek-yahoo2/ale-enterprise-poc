package com.company.ale.documenttracker.repository;

import com.company.ale.documenttracker.domain.DocumentTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// DocumentTracker repository
// Extends JpaRepository for basic CRUD
// Extends JpaSpecificationExecutor for dynamic queries
// Custom method: findByGenId
@Repository
public interface DocumentTrackerRepository extends 
    JpaRepository<DocumentTracker, Long>,
    JpaSpecificationExecutor<DocumentTracker> {
    
    // Find by GenId - returns Optional
    Optional<DocumentTracker> findByGenId(String genId);
}
