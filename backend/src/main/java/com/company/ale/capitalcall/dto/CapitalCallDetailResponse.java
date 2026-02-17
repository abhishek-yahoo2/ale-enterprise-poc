package com.company.ale.capitalcall.dto;

import com.company.ale.capitalcall.domain.WorkflowStatus;
import lombok.Builder;
import lombok.Value;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for capital call details response with breakdowns
 */
@Value
@Builder
public class CapitalCallDetailResponse {
    Long id;
    String aleBatchId;
    LocalDate fromDate;
    LocalDate toDate;
    BigDecimal totalAmount;
    WorkflowStatus workflowStatus;
    String lockedBy;
    LocalDateTime lockedAt;
    String clientName;
    String assetDescription;
    String toeReference;
    Boolean isSensitive;
    List<BreakdownResponse> breakdowns;
    LocalDateTime createdAt;
    String createdBy;
    LocalDateTime modifiedAt;
    String modifiedBy;
    Integer version;
}
