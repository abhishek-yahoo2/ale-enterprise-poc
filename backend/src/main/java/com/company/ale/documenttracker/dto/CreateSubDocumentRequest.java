package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.company.ale.documenttracker.domain.SubIdStatus;
import java.time.LocalDateTime;

/**
 * Request DTO for creating a Sub Document
 * Used as part of CreateDocumentTrackerRequest or PUT /api/document-tracker/{genId}/sub-documents
 */
@Value
@Builder
public class CreateSubDocumentRequest {
    
    @NotBlank(message = "SubId is required")
    private String subId;
    
    @NotNull(message = "Status is required")
    private SubIdStatus status;
    
    @NotBlank(message = "Status message is required")
    private String statusMessage;
    
    @NotNull(message = "Processed date is required")
    private LocalDateTime processedAt;
}
