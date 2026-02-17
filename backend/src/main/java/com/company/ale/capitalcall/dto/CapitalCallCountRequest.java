package com.company.ale.capitalcall.dto;

import com.company.ale.capitalcall.domain.CapitalCallQueue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for capital call count request
 * Represents request parameters for getting counts of capital calls by queue
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapitalCallCountRequest {
    
    @NotEmpty(message = "At least one queue is required")
    private List<CapitalCallQueue> queues;

    private LocalDate effectiveDateFrom;
    private LocalDate effectiveDateTo;
    private String aleBatchId;
    private String toeReference;
}   