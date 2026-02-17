package com.company.ale.documenttracker.dto;

import lombok.Builder;
import lombok.Value;
import jakarta.validation.constraints.NotNull;
import com.company.ale.common.pagination.SearchRequest;

/**
 * Request DTO for exporting Document Tracker documents
 * Used by POST /api/document-tracker/export endpoint
 * Supports CSV and Excel formats
 */
@Value
@Builder
public class ExportDocumentTrackerRequest {
    
    // Search criteria (filters, pagination, sort)
    @NotNull(message = "Search parameters are required")
    private SearchRequest searchRequest;
    
    // Export format: CSV or XLSX
    @NotNull(message = "Export format is required")
    private ExportFormat format;
    
    /**
     * Supported export formats
     */
    public enum ExportFormat {
        CSV,
        XLSX
    }
}
