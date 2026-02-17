package com.company.ale.alternativedata.dto;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for column preference response
 */
@Value
@Builder
public class ColumnPreferenceResponse {
    Long id;
    String userId;
    String moduleName;
    String viewName;
    List<String> columns;
    List<String> displayOrder;
    Boolean isDefault;
    LocalDateTime updatedAt;
}
