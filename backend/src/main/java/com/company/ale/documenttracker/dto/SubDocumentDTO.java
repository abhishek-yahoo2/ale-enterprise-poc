package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import com.company.ale.documenttracker.domain.SubIdStatus;
import com.company.ale.documenttracker.domain.Severity;
import java.time.LocalDateTime;

/**
 * DTO for Sub Document information
 */
@Value
@Builder
public class SubDocumentDTO {
    private String subId;
    private SubIdStatus status;
    private Severity severity;
    private String statusMessage;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime modifiedAt;
    private String modifiedBy;
}
