package com.company.ale.documenttracker.controller;

import com.company.ale.common.pagination.SearchRequest;
import com.company.ale.common.pagination.SearchResponse;
import com.company.ale.documenttracker.dto.DocumentTrackerDTO;
import com.company.ale.documenttracker.dto.DocumentDetailsDTO;
import com.company.ale.documenttracker.dto.CreateDocumentTrackerRequest;
import com.company.ale.documenttracker.dto.UpdateDocumentTrackerRequest;
import com.company.ale.documenttracker.dto.PercentageRequest;
import com.company.ale.documenttracker.service.DocumentTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.company.ale.common.validation.PercentageValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

// Document Tracker REST Controller
// Base path: /api/document-tracker
// Endpoints:
// - POST /search - Search documents
// - GET /{genId}/details - Get details
// Controller only handles HTTP - delegates to service
// Include OpenAPI annotations
@RestController
@RequestMapping("/api/document-tracker")
@RequiredArgsConstructor
@Validated
@Tag(name = "Document Tracker", description = "Document tracking APIs")
public class DocumentTrackerController {
    
    private final DocumentTrackerService service;
    
    // POST /api/document-tracker/search
    // Summary: Search document trackers
    // Request: SearchRequest with filters
    // Response: SearchResponse<DocumentTrackerDTO>
    @Operation(summary = "Search document trackers")
    @PostMapping("/search")
    public ResponseEntity<SearchResponse<DocumentTrackerDTO>> search(
            @Valid @RequestBody SearchRequest request) {
                System.out.println("Search filters: " + request.getFilters());
        SearchResponse<DocumentTrackerDTO> response = service.search(request);
        return ResponseEntity.ok(response);
    }
    
    // GET /api/document-tracker/{genId}/details
    // Summary: Get document details by GenId
    // Request: GenId path variable
    // Response: DocumentDetailsDTO
    @Operation(summary = "Get document details")
    @GetMapping("/{genId}/details")
    public ResponseEntity<DocumentDetailsDTO> getDocumentDetails(
            @PathVariable @Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Invalid GenId format") String genId) {
        DocumentDetailsDTO response = service.getDocumentDetails(genId);
        return ResponseEntity.ok(response);
    }
    
    // COPILOT: Generate a method that:
// 1. Validates the percentage total
// 2. Throws ValidationException if > 100
// 3. Error code: VAL_003
// 4. Use BigDecimal for calculation
    @Operation(summary = "Validate percentage total")
    @PostMapping("/validate-percentage")
    public ResponseEntity<Void> validatePercentage(@RequestBody PercentageRequest request) {
        PercentageValidator.validateTotal(request.getPercentages());
        return ResponseEntity.ok().build();
    }

    // POST /api/document-tracker
    // Summary: Create new document tracker
    // Request: CreateDocumentTrackerRequest
    // Response: DocumentTrackerDTO with status 201 Created
    @Operation(summary = "Create new document tracker")
    @PostMapping
    public ResponseEntity<DocumentTrackerDTO> createDocument(
            @Valid @RequestBody CreateDocumentTrackerRequest request) {
        DocumentTrackerDTO response = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT /api/document-tracker/{genId}
    // Summary: Update document tracker by GenId
    // Request: UpdateDocumentTrackerRequest
    // Response: DocumentTrackerDTO
    @Operation(summary = "Update document tracker")
    @PutMapping("/{genId}")
    public ResponseEntity<DocumentTrackerDTO> updateDocument(
            @PathVariable @Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Invalid GenId format") String genId,
            @Valid @RequestBody UpdateDocumentTrackerRequest request) {
        DocumentTrackerDTO response = service.update(genId, request);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/document-tracker/{genId}
    // Summary: Delete document tracker by GenId
    // Response: 204 No Content
    @Operation(summary = "Delete document tracker")
    @DeleteMapping("/{genId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable @Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Invalid GenId format") String genId) {
        service.delete(genId);
        return ResponseEntity.noContent().build();
    }
}