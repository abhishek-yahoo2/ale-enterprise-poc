package com.company.ale.documenttracker.service;

import com.company.ale.documenttracker.domain.DocumentTracker;
import com.company.ale.documenttracker.domain.SubDocument;
import com.company.ale.documenttracker.dto.DocumentTrackerDTO;
import com.company.ale.documenttracker.dto.DocumentDetailsDTO;
import com.company.ale.documenttracker.dto.SubDocumentDTO;
import com.company.ale.documenttracker.dto.CreateDocumentTrackerRequest;
import com.company.ale.documenttracker.dto.UpdateDocumentTrackerRequest;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

/**
 * Mapper for converting DocumentTracker entities to DTOs
 */
@Component
public class DocumentTrackerMapper {
    
    /**
     * Convert DocumentTracker entity to DocumentTrackerDTO
     * @param documentTracker the entity to convert
     * @return the DTO
     */
    public DocumentTrackerDTO toDTO(DocumentTracker documentTracker) {
        if (documentTracker == null) {
            return null;
        }
        
        return DocumentTrackerDTO.builder()
            .genId(documentTracker.getGenId())
            .documentName(documentTracker.getDocumentName())
            .documentDate(documentTracker.getDocumentDate())
            .documentType(documentTracker.getDocumentType())
            .clientName(documentTracker.getClientName())
            .aleGenId(documentTracker.getAleGenId())
            .accountNumber(documentTracker.getAccountNumber())
            .securityNumber(documentTracker.getSecurityNumber())
            .status(documentTracker.getStatus())
            .currentLocation(documentTracker.getCurrentLocation())
            .businessUnit(documentTracker.getBusinessUnit())
            .link(documentTracker.getLink())
            .receivedAt(documentTracker.getReceivedAt())
            .createdAt(documentTracker.getCreatedAt())
            .createdBy(documentTracker.getCreatedBy())
            .modifiedAt(documentTracker.getModifiedAt())
            .modifiedBy(documentTracker.getModifiedBy())
            .build();
    }
    
    /**
     * Convert DocumentTracker entity to DocumentDetailsDTO with sub-documents
     * @param documentTracker the entity to convert
     * @return the details DTO
     */
    public DocumentDetailsDTO toDetailsDTO(DocumentTracker documentTracker) {
        if (documentTracker == null) {
            return null;
        }
        
        List<SubDocumentDTO> subDocumentsDTO = documentTracker.getSubDocuments()
            .stream()
            .map(this::toSubDocumentDTO)
            .collect(Collectors.toList());
        
        return DocumentDetailsDTO.builder()
            .genId(documentTracker.getGenId())
            .documentName(documentTracker.getDocumentName())
            .documentDate(documentTracker.getDocumentDate())
            .documentType(documentTracker.getDocumentType())
            .clientName(documentTracker.getClientName())
            .aleGenId(documentTracker.getAleGenId())
            .accountNumber(documentTracker.getAccountNumber())
            .securityNumber(documentTracker.getSecurityNumber())
            .status(documentTracker.getStatus())
            .currentLocation(documentTracker.getCurrentLocation())
            .businessUnit(documentTracker.getBusinessUnit())
            .link(documentTracker.getLink())
            .receivedAt(documentTracker.getReceivedAt())
            .subDocuments(subDocumentsDTO)
            .createdAt(documentTracker.getCreatedAt())
            .createdBy(documentTracker.getCreatedBy())
            .modifiedAt(documentTracker.getModifiedAt())
            .modifiedBy(documentTracker.getModifiedBy())
            .build();
    }
    
    /**
     * Convert SubDocument entity to SubDocumentDTO
     * @param subDocument the entity to convert
     * @return the DTO
     */
    public SubDocumentDTO toSubDocumentDTO(SubDocument subDocument) {
        if (subDocument == null) {
            return null;
        }
        
        return SubDocumentDTO.builder()
            .subId(subDocument.getSubId())
            .status(subDocument.getStatus())
            .severity(subDocument.getSeverity())
            .statusMessage(subDocument.getStatusMessage())
            .processedAt(subDocument.getProcessedAt())
            .createdAt(subDocument.getCreatedAt())
            .createdBy(subDocument.getCreatedBy())
            .modifiedAt(subDocument.getModifiedAt())
            .modifiedBy(subDocument.getModifiedBy())
            .build();
    }

    /**
     * Convert CreateDocumentTrackerRequest to DocumentTracker entity
     * Sets audit fields: createdAt, createdBy
     * @param request the request DTO
     * @param username the user creating the document
     * @return the entity
     */
    public DocumentTracker toEntity(CreateDocumentTrackerRequest request, String username) {
        if (request == null) {
            return null;
        }
        
        LocalDateTime now = LocalDateTime.now();
        return DocumentTracker.builder()
            .genId(request.getGenId())
            .documentName(request.getDocumentName())
            .documentDate(request.getDocumentDate())
            .documentType(request.getDocumentType())
            .clientName(request.getClientName())
            .aleGenId(request.getAleGenId())
            .accountNumber(request.getAccountNumber())
            .securityNumber(request.getSecurityNumber())
            .status(request.getStatus())
            .currentLocation(request.getCurrentLocation())
            .businessUnit(request.getBusinessUnit())
            .link(request.getLink())
            .receivedAt(request.getReceivedAt())
            .createdAt(now)
            .createdBy(username)
            .modifiedAt(now)
            .modifiedBy(username)
            .build();
    }

    /**
     * Update DocumentTracker entity from UpdateDocumentTrackerRequest
     * Updates fields and sets modified audit fields
     * @param request the request DTO
     * @param entity the entity to update
     * @param username the user updating the document
     */
    public void updateEntity(UpdateDocumentTrackerRequest request, DocumentTracker entity, String username) {
        if (request == null || entity == null) {
            return;
        }
        
        entity.setDocumentName(request.getDocumentName());
        entity.setDocumentDate(request.getDocumentDate());
        entity.setDocumentType(request.getDocumentType());
        entity.setClientName(request.getClientName());
        entity.setAleGenId(request.getAleGenId());
        entity.setAccountNumber(request.getAccountNumber());
        entity.setSecurityNumber(request.getSecurityNumber());
        entity.setStatus(request.getStatus());
        entity.setCurrentLocation(request.getCurrentLocation());
        entity.setBusinessUnit(request.getBusinessUnit());
        entity.setLink(request.getLink());
        entity.setReceivedAt(request.getReceivedAt());
        entity.setModifiedAt(LocalDateTime.now());
        entity.setModifiedBy(username);
    }

}  

