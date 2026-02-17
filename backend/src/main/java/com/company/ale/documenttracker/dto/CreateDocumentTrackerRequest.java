package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Request DTO for creating a new Document Tracker
 * Used by POST /api/document-tracker endpoint
 */
@Value
@Builder
public class CreateDocumentTrackerRequest {
    
    @NotBlank(message = "GenId is required")
    @Pattern(regexp = "GEN\\d{8}", message = "GenId must match pattern GEN followed by 8 digits")
    private String genId;
    
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
    
    // Optional: sub-documents can be added later through separate endpoint
    private List<CreateSubDocumentRequest> subDocuments;
}
