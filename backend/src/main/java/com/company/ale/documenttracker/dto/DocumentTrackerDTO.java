package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Document Tracker search results
 * Contains basic and detailed information about a document tracker for API responses
 */
@Value
@Builder
public class DocumentTrackerDTO {
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
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime modifiedAt;
    private String modifiedBy;
}
