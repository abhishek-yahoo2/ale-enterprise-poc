package com.company.ale.capitalcall.dto;

import com.company.ale.capitalcall.domain.WorkflowStatus;
import lombok.Builder;
import lombok.Value;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for capital call response (search results)
 */
@Value
@Builder
public class CapitalCallResponse {
    Long id;
    String aleBatchId;
    LocalDate fromDate;
    LocalDate toDate;
    String dayType;
    BigDecimal totalAmount;
    WorkflowStatus workflowStatus;
    String lockedBy;
    LocalDateTime lockedAt;
    String clientName;
    String assetDescription;
    Boolean isSensitive;
    LocalDateTime createdAt;
    String createdBy;
}
