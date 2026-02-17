package com.company.ale.capitalcall.dto;

import com.company.ale.capitalcall.domain.BreakdownCategory;
import lombok.Builder;
import lombok.Value;
import java.math.BigDecimal;

/**
 * DTO for breakdown response
 */
@Value
@Builder
public class BreakdownResponse {
    Long id;
    BreakdownCategory category;
    BigDecimal percentage;
    BigDecimal calculatedAmount;
}
