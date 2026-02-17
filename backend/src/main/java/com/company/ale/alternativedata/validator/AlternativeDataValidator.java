package com.company.ale.alternativedata.validator;

import com.company.ale.alternativedata.dto.SaveColumnPreferenceRequest;
import com.company.ale.common.exception.ValidationException;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Validator for Alternative Data business rules
 */
@Component
public class AlternativeDataValidator {
    
    /**
     * Whitelist of allowed column names
     */
    private static final Set<String> ALLOWED_COLUMNS = new HashSet<>(Arrays.asList(
        "id",
        "clientName",
        "accountNumber",
        "fundFamily",
        "assetDescription",
        "dataSource",
        "reportDate",
        "status",
        "navValue",
        "commitmentAmount",
        "createdAt",
        "createdBy",
        "modifiedAt",
        "modifiedBy"
    ));
    
    /**
     * Validate column preferences (AD-01, AD-02)
     */
    public void validateColumnPreferences(SaveColumnPreferenceRequest request) {
        // AD-01: Max 40 columns
        if (request.getColumns() != null && request.getColumns().size() > 40) {
            throw new ValidationException("Maximum 40 columns allowed", "VAL_009");
        }
        
        // AD-02: Column whitelist - validate all columns are allowed
        if (request.getColumns() != null) {
            for (String column : request.getColumns()) {
                if (!ALLOWED_COLUMNS.contains(column)) {
                    throw new ValidationException("Invalid column: " + column, "VAL_010");
                }
            }
        }
        
        // Validate display order if provided
        if (request.getDisplayOrder() != null) {
            for (String column : request.getDisplayOrder()) {
                if (!ALLOWED_COLUMNS.contains(column)) {
                    throw new ValidationException("Invalid column in display order: " + column, "VAL_010");
                }
            }
        }
    }
}
