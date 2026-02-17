package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for validating percentage totals
 * Contains a list of percentages that should total 100
 */
@Value
@Builder
public class PercentageRequest {
    private List<BigDecimal> percentages;
}
