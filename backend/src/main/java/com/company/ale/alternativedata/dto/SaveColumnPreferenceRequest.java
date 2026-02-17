package com.company.ale.alternativedata.dto;

import lombok.Builder;
import lombok.Value;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * DTO for saving column preferences
 */
@Value
@Builder
public class SaveColumnPreferenceRequest {
    
    @NotBlank(message = "Module name is required")
    String moduleName;
    
    String viewName;
    
    @NotEmpty(message = "At least one column must be selected")
    @Size(max = 40, message = "Maximum 40 columns allowed")
    List<String> columns;
    
    List<String> displayOrder;
    
    Boolean isDefault;
}
