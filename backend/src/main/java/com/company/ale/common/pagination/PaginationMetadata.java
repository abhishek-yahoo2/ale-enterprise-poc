package com.company.ale.common.pagination;

import lombok.Builder;
import lombok.Value;

/**
 * Pagination metadata for search responses
 */
@Value
@Builder
public class PaginationMetadata {
    Integer currentPage;
    Integer pageSize;
    Long totalElements;
    Integer totalPages;
}
