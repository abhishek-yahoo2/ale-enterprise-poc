package com.company.ale.capitalcall.validator;

import com.company.ale.capitalcall.domain.CapitalCall;
import com.company.ale.capitalcall.dto.CreateCapitalCallRequest;
import com.company.ale.capitalcall.dto.UpdateCapitalCallRequest;
import com.company.ale.common.exception.ValidationException;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Validator for Capital Call business rules
 */
@Component
public class CapitalCallValidator {
    
    private static final int MAX_DATE_RANGE_DAYS = 365;
    
    /**
     * Validate create request (CC-03, CC-05, CC-06, CC-08, CC-10)
     */
    public void validateCreateRequest(CreateCapitalCallRequest request) {
        // CC-10: Total amount > 0
        if (request.getTotalAmount() == null || request.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Total amount must be greater than 0", "VAL_008");
        }
        
        // CC-05: Validate date range
        if (request.getFromDate() != null && request.getToDate() != null) {
            if (request.getFromDate().isAfter(request.getToDate())) {
                throw new ValidationException("From date must be before or equal to to date", "VAL_004");
            }
            
            // CC-08: Date range ≤ 1 year
            long daysBetween = ChronoUnit.DAYS.between(request.getFromDate(), request.getToDate());
            if (daysBetween > MAX_DATE_RANGE_DAYS) {
                throw new ValidationException("Date range cannot exceed 365 days", "VAL_006");
            }
        }
        
        // CC-06: Batch ID format validated by @Pattern annotation, but can double-check here if needed
        
        // CC-03: Percentage total ≤ 100
        BigDecimal percentageTotal = request.getBreakdowns().stream()
            .map(b -> b.getPercentage())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (percentageTotal.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ValidationException("Percentage total cannot exceed 100%", "VAL_003");
        }
    }
    
    /**
     * Validate update request
     */
    public void validateUpdateRequest(UpdateCapitalCallRequest request) {
        // CC-10: Total amount > 0
        if (request.getTotalAmount() == null || request.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Total amount must be greater than 0", "VAL_008");
        }
        
        // CC-05: Validate date range
        if (request.getFromDate() != null && request.getToDate() != null) {
            if (request.getFromDate().isAfter(request.getToDate())) {
                throw new ValidationException("From date must be before or equal to to date", "VAL_004");
            }
            
            // CC-08: Date range ≤ 1 year
            long daysBetween = ChronoUnit.DAYS.between(request.getFromDate(), request.getToDate());
            if (daysBetween > MAX_DATE_RANGE_DAYS) {
                throw new ValidationException("Date range cannot exceed 365 days", "VAL_006");
            }
        }
        
        // CC-03: Percentage total ≤ 100
        BigDecimal percentageTotal = request.getBreakdowns().stream()
            .map(b -> b.getPercentage())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (percentageTotal.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ValidationException("Percentage total cannot exceed 100%", "VAL_003");
        }
    }
    
    /**
     * Validate capital call for submission
     */
    public void validateForSubmission(CapitalCall entity) {
        // CC-03: Percentage total ≤ 100
        BigDecimal percentageTotal = entity.getBreakdowns().stream()
            .map(b -> b.getPercentage())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (percentageTotal.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new ValidationException("Percentage total cannot exceed 100%", "VAL_003");
        }
        
        // CC-05: Validate date range
        if (entity.getFromDate() != null && entity.getToDate() != null) {
            if (entity.getFromDate().isAfter(entity.getToDate())) {
                throw new ValidationException("From date must be before or equal to to date", "VAL_004");
            }
            
            // CC-08: Date range ≤ 1 year
            long daysBetween = ChronoUnit.DAYS.between(entity.getFromDate(), entity.getToDate());
            if (daysBetween > MAX_DATE_RANGE_DAYS) {
                throw new ValidationException("Date range cannot exceed 365 days", "VAL_006");
            }
        }
    }
}
