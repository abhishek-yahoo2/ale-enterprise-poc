package com.company.ale.alternativedata.service;

import com.company.ale.alternativedata.domain.AlternativeData;
import com.company.ale.alternativedata.domain.UserColumnPreference;
import com.company.ale.alternativedata.dto.AlternativeDataResponse;
import com.company.ale.alternativedata.dto.ColumnPreferenceResponse;
import com.company.ale.alternativedata.dto.SaveColumnPreferenceRequest;
import com.company.ale.alternativedata.repository.AlternativeDataRepository;
import com.company.ale.alternativedata.repository.UserColumnPreferenceRepository;
import com.company.ale.alternativedata.validator.AlternativeDataValidator;
import com.company.ale.common.exception.ResourceNotFoundException;
import com.company.ale.common.pagination.SearchRequest;
import com.company.ale.common.pagination.SearchResponse;
import com.company.ale.common.security.AuthorizationService;
import com.company.ale.common.security.RuleType;
import com.company.ale.documenttracker.service.SortUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * Service for Alternative Data operations
 * Handles business logic for alternative data management
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AlternativeDataService {
    
    private final AlternativeDataRepository repository;
    private final UserColumnPreferenceRepository preferenceRepository;
    private final AuthorizationService authorizationService;
    private final AlternativeDataValidator validator;
    private final AlternativeDataMapper mapper;
    
    /**
     * Search alternative data with filters
     */
    public SearchResponse<AlternativeDataResponse> search(SearchRequest request) {
        authorizationService.checkPermission(RuleType.RULE_VIEW);
        
        AlternativeDataSpecification spec = new AlternativeDataSpecification(request.getFilters());
        
        Pageable pageable = PageRequest.of(
            request.getPagination().getPageOrDefault(),
            request.getPagination().getSizeOrDefault(),
            SortUtil.toSort(request.getSort())
        );
        
        Page<AlternativeData> page = repository.findAll(spec, pageable);
        
        return SearchResponse.<AlternativeDataResponse>builder()
            .data(page.map(mapper::toResponse).getContent())
            .pagination(com.company.ale.common.pagination.PaginationMetadata.builder()
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build())
            .build();
    }
    
    /**
     * Get column preferences for a user and module
     */
    public ColumnPreferenceResponse getColumnPreferences(String userId, String moduleName) {
        authorizationService.checkPermission(RuleType.RULE_VIEW);
        
        UserColumnPreference preference = preferenceRepository
            .findByUserIdAndModuleName(userId, moduleName)
            .orElseGet(() -> createDefaultPreferences(userId, moduleName));
        
        return mapper.toPreferenceResponse(preference);
    }
    
    /**
     * Save column preferences for a user
     */
    @Transactional
    public ColumnPreferenceResponse saveColumnPreferences(String userId, SaveColumnPreferenceRequest request) {
        authorizationService.checkPermission(RuleType.RULE_EDIT);
        
        // Validate business rules (AD-01, AD-02)
        validator.validateColumnPreferences(request);
        
        UserColumnPreference preference = preferenceRepository
            .findByUserIdAndModuleName(userId, request.getModuleName())
            .orElseGet(() -> UserColumnPreference.builder()
                .userId(userId)
                .moduleName(request.getModuleName())
                .build());
        
        preference.setViewName(request.getViewName());
        preference.setColumnNames(request.getColumns());
        preference.setDisplayOrder(request.getDisplayOrder());
        preference.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);
        preference.setUpdatedAt(LocalDateTime.now());
        
        UserColumnPreference saved = preferenceRepository.save(preference);
        return mapper.toPreferenceResponse(saved);
    }
    
    /**
     * Create default preferences for alternative data module
     */
    private UserColumnPreference createDefaultPreferences(String userId, String moduleName) {
        return UserColumnPreference.builder()
            .userId(userId)
            .moduleName(moduleName)
            .viewName("Default View")
            .columnNames(java.util.Arrays.asList(
                "id", "clientName", "accountNumber", "fundFamily", "dataSource", "reportDate", "status"
            ))
            .displayOrder(java.util.Arrays.asList(
                "clientName", "accountNumber", "fundFamily", "dataSource", "reportDate", "status", "id"
            ))
            .isDefault(true)
            .updatedAt(LocalDateTime.now())
            .build();
    }
}
