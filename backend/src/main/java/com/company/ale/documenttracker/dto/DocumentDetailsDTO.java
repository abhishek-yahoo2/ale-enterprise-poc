package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Document Tracker detailed information
 * Contains complete information about a document tracker including sub-documents
 */
@Value
@Builder
public class DocumentDetailsDTO {
    private String genId;
    private String documentName;
    private LocalDate documentDate;
    private String documentType;
    private String clientName;
    private String aleGenId;
    private String accountNumber;
    private String securityNumber;
    private String status;
    private String currentLocation;
    private String businessUnit;
    private String link;
    private LocalDateTime receivedAt;
    private List<SubDocumentDTO> subDocuments;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime modifiedAt;
    private String modifiedBy;
}
