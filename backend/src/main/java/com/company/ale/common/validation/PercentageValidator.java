package com.company.ale.common.validation;

import com.company.ale.common.exception.ValidationException;

import java.math.BigDecimal;
import java.util.List;

/**
 * Reusable percentage validation utilities.
 */
public final class PercentageValidator {

    private PercentageValidator() {}

    /**
     * Validates that the sum of the provided percentages does not exceed 100.
     * Throws ValidationException with error code VAL_003 when the total > 100.
     */
    public static void validateTotal(List<BigDecimal> percentages) {
        if (percentages == null || percentages.isEmpty()) return;
        BigDecimal total = percentages.stream()
                .filter(p -> p != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (total.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ValidationException("Total percentage cannot exceed 100", "VAL_003");
        }
    }
}
