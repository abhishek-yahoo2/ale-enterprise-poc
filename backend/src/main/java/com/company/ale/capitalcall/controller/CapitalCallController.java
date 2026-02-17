package com.company.ale.capitalcall.controller;

import com.company.ale.capitalcall.domain.CapitalCallQueue;
import com.company.ale.capitalcall.dto.*;
import com.company.ale.capitalcall.service.CapitalCallService;
import com.company.ale.common.pagination.SearchRequest;
import com.company.ale.common.pagination.SearchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
/**
 * REST Controller for Capital Call operations
 * Base path: /api/capital-call
 */
@RestController
@RequestMapping("/api/capital-call")
@RequiredArgsConstructor
@Validated
@Tag(name = "Capital Call", description = "Capital Call Management APIs")
public class CapitalCallController {
    
    private final CapitalCallService service;
    
    /**
     * Search capital calls with filters
     * POST /api/capital-call/search
     */
    @Operation(summary = "Search capital calls",
               description = "Search capital calls with advanced filtering, pagination, and sorting")
    @PostMapping("/search")
    public ResponseEntity<SearchResponse<CapitalCallResponse>> search(
            @Valid @RequestBody SearchRequest request) {
        SearchResponse<CapitalCallResponse> response = service.search(request);
        return ResponseEntity.ok(response);
    }
    
// Create count api with queue parameters
    @Operation(summary = "Get capital call count",
               description = "Get count of capital calls matching filters. Optional queue parameter to get count of items in processing queue.")
    @GetMapping("/count")
    public ResponseEntity<CapitalCallCountResponse> getCounts(
            @RequestParam(required = false) List<String> queues,
            @RequestParam(required = false) LocalDate effectiveDateFrom,
            @RequestParam(required = false) LocalDate effectiveDateTo,
            @RequestParam(required = false) String aleBatchId,
            @RequestParam(required = false) String toeReference,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Convert String queue names to CapitalCallQueue enums
        List<CapitalCallQueue> queueList = queues != null 
            ? queues.stream()
                .map(q -> {
                    try {
                        return CapitalCallQueue.valueOf(q.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid queue name: " + q);
                    }
                })
                .collect(Collectors.toList())
            : List.of();

        CapitalCallCountRequest request = CapitalCallCountRequest.builder()
            .queues(queueList)
            .effectiveDateFrom(effectiveDateFrom)
            .effectiveDateTo(effectiveDateTo)
            .aleBatchId(aleBatchId)
            .toeReference(toeReference)
            .build();

        return ResponseEntity.ok(service.getCountsByQueue(request));
    }
    
    
    /**
     * Get capital call details by ID
     * GET /api/capital-call/{id}
     */
    @Operation(summary = "Get capital call details",
               description = "Retrieve complete capital call details including breakdowns")
    @GetMapping("/{id}")
    public ResponseEntity<CapitalCallDetailResponse> getById(@PathVariable Long id) {
        CapitalCallDetailResponse response = service.getById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Create a new capital call
     * POST /api/capital-call
     */
    @Operation(summary = "Create capital call",
               description = "Create a new capital call in DRAFT status. Automatically acquires lock for the creator.")
    @PostMapping
    public ResponseEntity<CapitalCallDetailResponse> create(
            @Valid @RequestBody CreateCapitalCallRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        CapitalCallDetailResponse response = service.create(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Update an existing capital call
     * PUT /api/capital-call/{id}
     */
    @Operation(summary = "Update capital call",
               description = "Update an existing capital call. Requires lock ownership.")
    @PutMapping("/{id}")
    public ResponseEntity<CapitalCallDetailResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCapitalCallRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        CapitalCallDetailResponse response = service.update(id, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Submit capital call for approval
     * POST /api/capital-call/{id}/submit
     */
    @Operation(summary = "Submit capital call",
               description = "Submit capital call for approval. Transitions status from DRAFT to SUBMITTED. Releases lock.")
    @PostMapping("/{id}/submit")
    public ResponseEntity<CapitalCallDetailResponse> submit(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        CapitalCallDetailResponse response = service.submit(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Approve capital call
     * POST /api/capital-call/{id}/approve
     */
    @Operation(summary = "Approve capital call",
               description = "Approve a submitted capital call. Transitions status from SUBMITTED to APPROVED.")
    @PostMapping("/{id}/approve")
    public ResponseEntity<CapitalCallDetailResponse> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        CapitalCallDetailResponse response = service.approve(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Reject capital call
     * POST /api/capital-call/{id}/reject
     */
    @Operation(summary = "Reject capital call",
               description = "Reject a submitted capital call. Transitions status from SUBMITTED back to DRAFT.")
    @PostMapping("/{id}/reject")
    public ResponseEntity<CapitalCallDetailResponse> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        CapitalCallDetailResponse response = service.reject(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Unlock capital call (administrative)
     * POST /api/capital-call/{id}/unlock
     */
    @Operation(summary = "Unlock capital call",
               description = "Force unlock a capital call. Requires RULE_UNLOCK_WORK_ITEM permission.")
    @PostMapping("/{id}/unlock")
    public ResponseEntity<Void> unlock(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        service.unlock(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
