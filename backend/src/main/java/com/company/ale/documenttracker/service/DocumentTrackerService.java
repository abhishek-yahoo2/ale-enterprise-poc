package com.company.ale.documenttracker.service;

import com.company.ale.common.pagination.SearchRequest;
import com.company.ale.common.pagination.SearchResponse;
import com.company.ale.common.pagination.PaginationMetadata;
import com.company.ale.documenttracker.dto.DocumentTrackerDTO;
import com.company.ale.documenttracker.dto.DocumentDetailsDTO;
import com.company.ale.documenttracker.dto.CreateDocumentTrackerRequest;
import com.company.ale.documenttracker.dto.UpdateDocumentTrackerRequest;
import com.company.ale.documenttracker.domain.DocumentTracker;
import com.company.ale.documenttracker.repository.DocumentTrackerRepository;
import com.company.ale.common.exception.ResourceNotFoundException;
import com.company.ale.common.security.AuthorizationService;
import com.company.ale.common.security.RuleType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.LocalDateTime;

// Document Tracker Service
// Responsibilities:
// - Search documents with filters, pagination, sorting (READ)
// - Get document details with sub-documents (READ)
// - Create new documents (CREATE)
// - Update existing documents (UPDATE)
// - Delete documents (DELETE)
// - Check authorization before all operations
// - Use Specification pattern for dynamic queries
// Class-level: @Transactional (allows both read and write operations)
@Service
@Transactional
@RequiredArgsConstructor
public class DocumentTrackerService {
    
    private final DocumentTrackerRepository repository;
    private final AuthorizationService authorizationService;
    private final DocumentTrackerMapper mapper;
    
    // Search documents with filters
    // Steps:
    // 1. Check authorization (RULE_VIEW)
    // 2. Build Specification from filters
    // 3. Create Pageable with pagination and sort
    // 4. Execute query
    // 5. Map to DTOs and return SearchResponse
    public SearchResponse<DocumentTrackerDTO> search(SearchRequest request) {
        // 1. Authorization check
        authorizationService.checkPermission(RuleType.RULE_VIEW);
        System.out.println("Search filters: " + request.getFilters());
        // 2. Build Specification from filters
        DocumentTrackerSpecification spec = new DocumentTrackerSpecification(request.getFilters());
        
        // 3. Create Pageable
        Pageable pageable = PageRequest.of(
            request.getPagination().getPage(), 
            request.getPagination().getSize(), 
            SortUtil.toSort(request.getSort())
        );
        
        // 4. Execute query
        Page<DocumentTracker> page = repository.findAll(spec, pageable);
        
        // 5. Map to DTOs and return SearchResponse
        PaginationMetadata paginationMetadata = PaginationMetadata.builder()
            .currentPage(page.getNumber())
            .pageSize(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .build();
        
        return SearchResponse.<DocumentTrackerDTO>builder()
            .data(page.map(mapper::toDTO).getContent())
            .pagination(paginationMetadata)
            .build();
    }

    // Get document details by GenId
    // Steps:
    // 1. Check authorization (RULE_VIEW)
    // 2. Find document by GenId
    // 3. If not found, throw exception
    // 4. Map to DocumentDetailsDTO and return
    @Transactional(readOnly = true)
    public DocumentDetailsDTO getDocumentDetails(String genId) {
        // 1. Authorization check
        authorizationService.checkPermission(RuleType.RULE_VIEW);
        
        // 2. Find document by GenId
        DocumentTracker document = repository.findByGenId(genId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with GenId: " + genId));
        
        // 3. Map to DocumentDetailsDTO and return
        return mapper.toDetailsDTO(document);
    }

    // Create new document
    // Steps:
    // 1. Check authorization (RULE_CREATE)
    // 2. Check if document with same GenId already exists
    // 3. Create new DocumentTracker entity
    // 4. Set audit fields (createdAt, createdBy)
    // 5. Save and return DTO
    public DocumentTrackerDTO create(CreateDocumentTrackerRequest request) {
        // 1. Authorization check
        authorizationService.checkPermission(RuleType.RULE_CREATE);
        
        // 2. Check if document already exists
        if (repository.findByGenId(request.getGenId()).isPresent()) {
            throw new RuntimeException("Document with GenId " + request.getGenId() + " already exists");
        }
        
        // 3. Get current user for audit
        String currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        
        // 4. Create new entity
        DocumentTracker document = DocumentTracker.builder()
            .genId(request.getGenId())
            .documentType(request.getDocumentType())
            .receivedAt(request.getReceivedAt())
            .createdAt(now)
            .createdBy(currentUser)
            .modifiedAt(now)
            .modifiedBy(currentUser)
            .build();
        
        // 5. Save and return
        DocumentTracker saved = repository.save(document);
        return mapper.toDTO(saved);
    }

    // Update existing document
    // Steps:
    // 1. Check authorization (RULE_UPDATE)
    // 2. Find document by GenId
    // 3. If not found, throw exception
    // 4. Update fields
    // 5. Set modified audit fields
    // 6. Save and return DTO
    public DocumentTrackerDTO update(String genId, UpdateDocumentTrackerRequest request) {
        // 1. Authorization check
        authorizationService.checkPermission(RuleType.RULE_UPDATE);
        
        // 2. Find document
        DocumentTracker document = repository.findByGenId(genId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with GenId: " + genId));
        
        // 3. Get current user for audit
        String currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        
        // 4. Update fields
        document.setDocumentType(request.getDocumentType());
        document.setReceivedAt(request.getReceivedAt());
        document.setModifiedAt(now);
        document.setModifiedBy(currentUser);
        
        // 5. Save and return
        DocumentTracker updated = repository.save(document);
        return mapper.toDTO(updated);
    }

    // Delete document by GenId
    // Steps:
    // 1. Check authorization (RULE_DELETE)
    // 2. Find document by GenId
    // 3. If not found, throw exception
    // 4. Delete from repository
    public void delete(String genId) {
        // 1. Authorization check
        authorizationService.checkPermission(RuleType.RULE_DELETE);
        
        // 2. Find document
        DocumentTracker document = repository.findByGenId(genId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with GenId: " + genId));
        
        // 3. Delete
        repository.delete(document);
    }

    // Helper method to get current authenticated user
    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "SYSTEM";
    }
}