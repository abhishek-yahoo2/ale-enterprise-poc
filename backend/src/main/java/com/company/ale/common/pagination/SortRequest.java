package com.company.ale.common.pagination;

import lombok.Builder;
import lombok.Value;
import org.springframework.data.domain.Sort;

/**
 * Request object for sorting parameters
 * Specifies the field name and direction to sort by
 */
@Value
@Builder
public class SortRequest {
    private String field;
    private Sort.Direction direction;
}
