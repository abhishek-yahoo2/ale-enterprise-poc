package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Request DTO for updating an existing Document Tracker
 * Used by PUT /api/document-tracker/{genId} endpoint
 */
@Value
@Builder
public class UpdateDocumentTrackerRequest {
    
    @NotBlank(message = "Document Name is required")
    private String documentName;
    
    @NotNull(message = "Document Date is required")
    private LocalDate documentDate;
    
    @NotBlank(message = "Document Type is required")
    private String documentType;
    
    @NotBlank(message = "Client Name is required")
    private String clientName;
    
    private String aleGenId;
    
    private String accountNumber;
    
    private String securityNumber;
    
    private String status;
    
    private String currentLocation;
    
    private String businessUnit;
    
    private String link;
    
    @NotNull(message = "Received date is required")
    private LocalDateTime receivedAt;
}
