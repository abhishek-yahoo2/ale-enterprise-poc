package com.company.ale.capitalcall.dto;

import lombok.Builder;
import lombok.Value;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for creating a capital call
 */
@Value
@Builder
public class CreateCapitalCallRequest {
    
    @NotBlank(message = "Batch ID is required")
    @Pattern(regexp = "ALE-\\d{6}", message = "Batch ID must match pattern ALE-XXXXXX")
    String aleBatchId;
    
    LocalDate fromDate;
    
    LocalDate toDate;
    
    String dayType;
    
    @NotBlank(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    BigDecimal totalAmount;
    
    String clientName;
    
    String assetDescription;
    
    String toeReference;
    
    Boolean isSensitive;
    
    @NotEmpty(message = "At least one breakdown is required")
    @Valid
    List<CreateBreakdownRequest> breakdowns;
}
