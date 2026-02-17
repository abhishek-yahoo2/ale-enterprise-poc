package com.company.ale.alternativedata.service;

import com.company.ale.alternativedata.domain.AlternativeData;
import com.company.ale.alternativedata.domain.UserColumnPreference;
import com.company.ale.alternativedata.dto.AlternativeDataResponse;
import com.company.ale.alternativedata.dto.ColumnPreferenceResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper for Alternative Data entities to DTOs
 */
@Component
public class AlternativeDataMapper {
    
    /**
     * Convert AlternativeData entity to AlternativeDataResponse
     */
    public AlternativeDataResponse toResponse(AlternativeData entity) {
        if (entity == null) {
            return null;
        }
        
        return AlternativeDataResponse.builder()
            .id(entity.getId())
            .clientName(entity.getClientName())
            .accountNumber(entity.getAccountNumber())
            .fundFamily(entity.getFundFamily())
            .assetDescription(entity.getAssetDescription())
            .dataSource(entity.getDataSource())
            .reportDate(entity.getReportDate())
            .status(entity.getStatus())
            .navValue(entity.getNavValue())
            .commitmentAmount(entity.getCommitmentAmount())
            .createdAt(entity.getCreatedAt())
            .createdBy(entity.getCreatedBy())
            .modifiedAt(entity.getModifiedAt())
            .modifiedBy(entity.getModifiedBy())
            .build();
    }
    
    /**
     * Convert UserColumnPreference entity to ColumnPreferenceResponse
     */
    public ColumnPreferenceResponse toPreferenceResponse(UserColumnPreference entity) {
        if (entity == null) {
            return null;
        }
        
        return ColumnPreferenceResponse.builder()
            .id(entity.getId())
            .userId(entity.getUserId())
            .moduleName(entity.getModuleName())
            .viewName(entity.getViewName())
            .columns(entity.getColumnNames())
            .displayOrder(entity.getDisplayOrder())
            .isDefault(entity.getIsDefault())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
}
