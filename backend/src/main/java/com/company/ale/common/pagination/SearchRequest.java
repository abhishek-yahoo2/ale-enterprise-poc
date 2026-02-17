package com.company.ale.common.pagination;

import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * COPILOT PROMPT:
 * Create a SearchRequest class with the following requirements:
 * - Field: Map<String, Object> filters - for search filters
 * - Field: PaginationRequest pagination - for page and size
 * - Field: List<SortRequest> sort - for sorting
 * - Use Lombok @Data and @Builder annotations
 * - All fields should be private
 * - Class should be immutable using @Value
 * Follow the specification in backend-spec.md section 3.1
 */
// import lombok.Builder;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
// @Builder
public class SearchRequest {
    private Map<String, Object> filters;

    private PaginationRequest pagination;

    private List<SortRequest> sort;
}
