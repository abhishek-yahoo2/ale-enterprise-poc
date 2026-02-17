package com.company.ale.capitalcall.repository;

import com.company.ale.capitalcall.domain.CapitalCall;
import com.company.ale.capitalcall.domain.CapitalCallQueue;
import com.company.ale.capitalcall.domain.WorkflowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for CapitalCall entity
 */
@Repository
public interface CapitalCallRepository extends JpaRepository<CapitalCall, Long>, JpaSpecificationExecutor<CapitalCall> {
    
    Optional<CapitalCall> findByAleBatchId(String aleBatchId);
    
    List<CapitalCall> findByWorkflowStatusAndCreatedAtBefore(WorkflowStatus status, LocalDateTime date);
    
    List<CapitalCall> findByLockedBy(String username);
    
    Long countByLockedByAndLockedAtAfter(String username, LocalDateTime since);

    @Query("SELECT COUNT(c) FROM CapitalCall c WHERE c.queue = :queue " +
           "AND (:effectiveDateFrom IS NULL OR c.fromDate >= :effectiveDateFrom) " +
           "AND (:effectiveDateTo IS NULL OR c.toDate <= :effectiveDateTo) " +
           "AND (:aleBatchId IS NULL OR c.aleBatchId = :aleBatchId) " +
           "AND (:toeReference IS NULL OR c.toeReference = :toeReference)")
    long countByQueueAndFilters(
        @Param("queue") String queue,
        @Param("effectiveDateFrom") LocalDate effectiveDateFrom,
        @Param("effectiveDateTo") LocalDate effectiveDateTo,
        @Param("aleBatchId") String aleBatchId,
        @Param("toeReference") String toeReference
    );
}
