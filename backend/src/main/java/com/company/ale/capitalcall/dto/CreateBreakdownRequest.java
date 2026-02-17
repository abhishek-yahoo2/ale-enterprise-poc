package com.company.ale.capitalcall.dto;

import com.company.ale.capitalcall.domain.BreakdownCategory;
import lombok.Builder;
import lombok.Value;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

/**
 * DTO for breakdown creation request
 */
@Value
@Builder
public class CreateBreakdownRequest {
    
    BreakdownCategory category;
    
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    BigDecimal percentage;
}
