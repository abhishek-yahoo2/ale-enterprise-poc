package com.company.ale.capitalcall.service;

import com.company.ale.capitalcall.domain.CapitalCall;
import com.company.ale.capitalcall.domain.CapitalCallBreakdown;
import com.company.ale.capitalcall.domain.CapitalCallQueue;
import com.company.ale.capitalcall.domain.WorkflowStatus;
import com.company.ale.capitalcall.dto.*;
import com.company.ale.capitalcall.repository.CapitalCallRepository;
import com.company.ale.capitalcall.validator.CapitalCallValidator;
import com.company.ale.common.exception.ResourceNotFoundException;
import com.company.ale.common.exception.AuthorizationException;
import com.company.ale.common.pagination.SearchRequest;
import com.company.ale.common.pagination.SearchResponse;
import com.company.ale.common.security.AuthorizationService;
import com.company.ale.common.security.RuleType;
import com.company.ale.documenttracker.service.SortUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for Capital Call operations
 * Handles business logic for capital call management
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CapitalCallService {
    
    private final CapitalCallRepository repository;
    private final AuthorizationService authorizationService;
    private final CapitalCallValidator validator;
    private final CapitalCallMapper mapper;
    
    /**
     * Search capital calls with filters, pagination, and sorting
     */
    public SearchResponse<CapitalCallResponse> search(SearchRequest request) {
        authorizationService.checkPermission(RuleType.RULE_VIEW);
        
        CapitalCallSpecification spec = new CapitalCallSpecification(request.getFilters());
        
        Pageable pageable = PageRequest.of(
            request.getPagination().getPageOrDefault(),
            request.getPagination().getSizeOrDefault(),
            SortUtil.toSort(request.getSort())
        );
        
        Page<CapitalCall> page = repository.findAll(spec, pageable);
        
        return SearchResponse.<CapitalCallResponse>builder()
            .data(page.map(mapper::toResponse).getContent())
            .pagination(com.company.ale.common.pagination.PaginationMetadata.builder()
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build())
            .build();
    }
    
    /**
     * Get capital call details by ID
     */
    public CapitalCallDetailResponse getById(Long id) {
        authorizationService.checkPermission(RuleType.RULE_VIEW);
        
        CapitalCall entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Capital call not found with ID: " + id));
        
        return mapper.toDetailResponse(entity);
    }
    
    /**
     * Create a new capital call
     */
    @Transactional
    public CapitalCallDetailResponse create(CreateCapitalCallRequest request, String username) {
        authorizationService.checkPermission(RuleType.RULE_EDIT);
        
        // Validate business rules
        validator.validateCreateRequest(request);
        
        // Create entity
        CapitalCall entity = mapper.toEntity(request);
        entity.setWorkflowStatus(WorkflowStatus.DRAFT);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setCreatedBy(username);
        entity.setLockedBy(username);
        entity.setLockedAt(LocalDateTime.now());
        
        // Add breakdowns
        for (CreateBreakdownRequest breakdownRequest : request.getBreakdowns()) {
            CapitalCallBreakdown breakdown = CapitalCallBreakdown.builder()
                .category(breakdownRequest.getCategory())
                .percentage(breakdownRequest.getPercentage())
                .build();
            breakdown.calculateAmount(request.getTotalAmount(), 2);
            entity.addBreakdown(breakdown);
        }
        
        CapitalCall saved = repository.save(entity);
        return mapper.toDetailResponse(saved);
    }
    
    /**
     * Update an existing capital call
     */
    @Transactional
    public CapitalCallDetailResponse update(Long id, UpdateCapitalCallRequest request, String username) {
        authorizationService.checkPermission(RuleType.RULE_EDIT);
        
        CapitalCall entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Capital call not found with ID: " + id));
        
        // Check lock ownership (CC-01)
        if (!username.equals(entity.getLockedBy())) {
            throw new AuthorizationException("Capital call is locked by another user");
        }
        
        // Prevent update if status is APPROVED (business rule)
        if (entity.getWorkflowStatus() == WorkflowStatus.APPROVED) {
            throw new AuthorizationException("Cannot update an approved capital call");
        }
        
        // Validate business rules
        validator.validateUpdateRequest(request);
        
        // Update entity
        mapper.updateEntity(request, entity);
        entity.setModifiedBy(username);
        entity.setModifiedAt(LocalDateTime.now());
        
        // Update breakdowns
        entity.getBreakdowns().clear();
        for (UpdateBreakdownRequest breakdownRequest : request.getBreakdowns()) {
            CapitalCallBreakdown breakdown = CapitalCallBreakdown.builder()
                .id(breakdownRequest.getId())
                .category(breakdownRequest.getCategory())
                .percentage(breakdownRequest.getPercentage())
                .build();
            breakdown.calculateAmount(request.getTotalAmount(), 2);
            entity.addBreakdown(breakdown);
        }
        
        CapitalCall updated = repository.save(entity);
        return mapper.toDetailResponse(updated);
    }
    
    /**
     * Submit a capital call for approval (DRAFT → SUBMITTED)
     */
    @Transactional
    public CapitalCallDetailResponse submit(Long id, String username) {
        authorizationService.checkPermission(RuleType.RULE_SUBMIT);
        
        CapitalCall entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Capital call not found with ID: " + id));
        
        // Validate state transition (CC-07)
        if (entity.getWorkflowStatus() != WorkflowStatus.DRAFT) {
            throw new AuthorizationException("Capital call can only be submitted from DRAFT status");
        }
        
        // Validate business rules
        validator.validateForSubmission(entity);
        
        // Update status
        entity.setWorkflowStatus(WorkflowStatus.SUBMITTED);
        entity.setModifiedBy(username);
        entity.setModifiedAt(LocalDateTime.now());
        entity.setLockedBy(null);
        entity.setLockedAt(null);
        
        CapitalCall updated = repository.save(entity);
        return mapper.toDetailResponse(updated);
    }
    
    /**
     * Approve a capital call (SUBMITTED → APPROVED)
     */
    @Transactional
    public CapitalCallDetailResponse approve(Long id, String username) {
        authorizationService.checkPermission(RuleType.RULE_APPROVE);
        
        CapitalCall entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Capital call not found with ID: " + id));
        
        // Validate state transition (CC-07)
        if (entity.getWorkflowStatus() != WorkflowStatus.SUBMITTED) {
            throw new AuthorizationException("Capital call can only be approved from SUBMITTED status");
        }
        
        // Update status
        entity.setWorkflowStatus(WorkflowStatus.APPROVED);
        entity.setModifiedBy(username);
        entity.setModifiedAt(LocalDateTime.now());
        
        CapitalCall updated = repository.save(entity);
        return mapper.toDetailResponse(updated);
    }
    
    /**
     * Reject a capital call (SUBMITTED → DRAFT)
     */
    @Transactional
    public CapitalCallDetailResponse reject(Long id, String username) {
        authorizationService.checkPermission(RuleType.RULE_APPROVE);
        
        CapitalCall entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Capital call not found with ID: " + id));
        
        // Validate state transition (CC-07)
        if (entity.getWorkflowStatus() != WorkflowStatus.SUBMITTED) {
            throw new AuthorizationException("Capital call can only be rejected from SUBMITTED status");
        }
        
        // Update status and re-acquire lock
        entity.setWorkflowStatus(WorkflowStatus.REJECTED);
        entity.setModifiedBy(username);
        entity.setModifiedAt(LocalDateTime.now());
        entity.setLockedBy(username);
        entity.setLockedAt(LocalDateTime.now());
        
        CapitalCall updated = repository.save(entity);
        return mapper.toDetailResponse(updated);
    }
    
    /**
     * Unlock a capital call (administrative operation)
     */
    @Transactional
    public void unlock(Long id, String username) {
        authorizationService.checkPermission(RuleType.RULE_UNLOCK_WORK_ITEM);
        
        CapitalCall entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Capital call not found with ID: " + id));
        
        entity.setLockedBy(null);
        entity.setLockedAt(null);
        entity.setModifiedBy(username);
        entity.setModifiedAt(LocalDateTime.now());
        
        repository.save(entity);
    }

    public CapitalCallCountResponse getCountsByQueue(CapitalCallCountRequest request) {
        Map<String, Long> counts = new LinkedHashMap<>();

        for (CapitalCallQueue queue : request.getQueues()) {
            long count = repository.countByQueueAndFilters(
                queue.name(),
                request.getEffectiveDateFrom(),
                request.getEffectiveDateTo(),
                request.getAleBatchId(),
                request.getToeReference()
            );
            counts.put(queue.name(), count);
        }

        return CapitalCallCountResponse.builder()
            .counts(counts)
            .build();
    }
}
