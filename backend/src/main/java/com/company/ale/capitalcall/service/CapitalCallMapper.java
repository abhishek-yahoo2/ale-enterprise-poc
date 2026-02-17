package com.company.ale.capitalcall.service;

import com.company.ale.capitalcall.domain.CapitalCall;
import com.company.ale.capitalcall.domain.CapitalCallBreakdown;
import com.company.ale.capitalcall.dto.*;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * Mapper for converting Capital Call entities to DTOs
 */
@Component
public class CapitalCallMapper {
    
    /**
     * Convert CapitalCall entity to CapitalCallResponse
     */
    public CapitalCallResponse toResponse(CapitalCall entity) {
        if (entity == null) {
            return null;
        }
        
        return CapitalCallResponse.builder()
            .id(entity.getId())
            .aleBatchId(entity.getAleBatchId())
            .fromDate(entity.getFromDate())
            .toDate(entity.getToDate())
            .dayType(entity.getDayType())
            .totalAmount(entity.getTotalAmount())
            .workflowStatus(entity.getWorkflowStatus())
            .lockedBy(entity.getLockedBy())
            .lockedAt(entity.getLockedAt())
            .clientName(entity.getClientName())
            .assetDescription(entity.getAssetDescription())
            .isSensitive(entity.getIsSensitive())
            .createdAt(entity.getCreatedAt())
            .createdBy(entity.getCreatedBy())
            .build();
    }
    
    /**
     * Convert CapitalCall entity to CapitalCallDetailResponse with breakdowns
     */
    public CapitalCallDetailResponse toDetailResponse(CapitalCall entity) {
        if (entity == null) {
            return null;
        }
        
        return CapitalCallDetailResponse.builder()
            .id(entity.getId())
            .aleBatchId(entity.getAleBatchId())
            .fromDate(entity.getFromDate())
            .toDate(entity.getToDate())
            .totalAmount(entity.getTotalAmount())
            .workflowStatus(entity.getWorkflowStatus())
            .lockedBy(entity.getLockedBy())
            .lockedAt(entity.getLockedAt())
            .clientName(entity.getClientName())
            .assetDescription(entity.getAssetDescription())
            .toeReference(entity.getToeReference())
            .isSensitive(entity.getIsSensitive())
            .breakdowns(entity.getBreakdowns().stream()
                .map(this::toBreakdownResponse)
                .collect(Collectors.toList()))
            .createdAt(entity.getCreatedAt())
            .createdBy(entity.getCreatedBy())
            .modifiedAt(entity.getModifiedAt())
            .modifiedBy(entity.getModifiedBy())
            .version(entity.getVersion())
            .build();
    }
    
    /**
     * Convert CapitalCallBreakdown entity to BreakdownResponse
     */
    public BreakdownResponse toBreakdownResponse(CapitalCallBreakdown entity) {
        if (entity == null) {
            return null;
        }
        
        return BreakdownResponse.builder()
            .id(entity.getId())
            .category(entity.getCategory())
            .percentage(entity.getPercentage())
            .calculatedAmount(entity.getCalculatedAmount())
            .build();
    }
    
    /**
     * Convert CreateCapitalCallRequest to CapitalCall entity
     */
    public CapitalCall toEntity(CreateCapitalCallRequest request) {
        if (request == null) {
            return null;
        }
        
        CapitalCall entity = CapitalCall.builder()
            .aleBatchId(request.getAleBatchId())
            .fromDate(request.getFromDate())
            .toDate(request.getToDate())
            .dayType(request.getDayType())
            .totalAmount(request.getTotalAmount())
            .clientName(request.getClientName())
            .assetDescription(request.getAssetDescription())
            .toeReference(request.getToeReference())
            .isSensitive(request.getIsSensitive())
            .build();
        
        return entity;
    }
    
    /**
     * Update CapitalCall entity from UpdateCapitalCallRequest
     */
    public void updateEntity(UpdateCapitalCallRequest request, CapitalCall entity) {
        if (request == null || entity == null) {
            return;
        }
        
        entity.setAleBatchId(request.getAleBatchId());
        entity.setFromDate(request.getFromDate());
        entity.setToDate(request.getToDate());
        entity.setDayType(request.getDayType());
        entity.setTotalAmount(request.getTotalAmount());
        entity.setClientName(request.getClientName());
        entity.setAssetDescription(request.getAssetDescription());
        entity.setToeReference(request.getToeReference());
        entity.setIsSensitive(request.getIsSensitive());
        entity.setModifiedAt(LocalDateTime.now());
    }
}
