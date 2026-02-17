package com.company.ale.alternativedata.controller;

import com.company.ale.alternativedata.dto.AlternativeDataResponse;
import com.company.ale.alternativedata.dto.ColumnPreferenceResponse;
import com.company.ale.alternativedata.dto.SaveColumnPreferenceRequest;
import com.company.ale.alternativedata.service.AlternativeDataService;
import com.company.ale.common.pagination.SearchRequest;
import com.company.ale.common.pagination.SearchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

/**
 * REST Controller for Alternative Data operations
 * Base path: /api/alternative-data
 */
@RestController
@RequestMapping("/api/alternative-data")
@RequiredArgsConstructor
@Validated
@Tag(name = "Alternative Data", description = "Alternative Data Management APIs")
public class AlternativeDataController {
    
    private final AlternativeDataService service;
    
    /**
     * Search alternative data with advanced filtering
     * POST /api/alternative-data/search
     */
    @Operation(summary = "Search alternative data",
               description = "Search alternative data records with advanced filtering, pagination, and sorting")
    @PostMapping("/search")
    public ResponseEntity<SearchResponse<AlternativeDataResponse>> search(
            @Valid @RequestBody SearchRequest request) {
        SearchResponse<AlternativeDataResponse> response = service.search(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get column preferences for a module
     * GET /api/alternative-data/column-preferences
     */
    @Operation(summary = "Get column preferences",
               description = "Retrieve user's column preferences for the module")
    @GetMapping("/column-preferences")
    public ResponseEntity<ColumnPreferenceResponse> getColumnPreferences(
            @RequestParam @NotBlank(message = "Module name is required") String moduleName,
            @AuthenticationPrincipal UserDetails userDetails) {
        ColumnPreferenceResponse response = service.getColumnPreferences(userDetails.getUsername(), moduleName);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Save column preferences
     * POST /api/alternative-data/column-preferences
     */
    @Operation(summary = "Save column preferences",
               description = "Save or update user's column preferences")
    @PostMapping("/column-preferences")
    public ResponseEntity<ColumnPreferenceResponse> saveColumnPreferences(
            @Valid @RequestBody SaveColumnPreferenceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ColumnPreferenceResponse response = service.saveColumnPreferences(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }
}
