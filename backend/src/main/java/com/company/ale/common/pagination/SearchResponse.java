package com.company.ale.common.pagination;

import lombok.Builder;
import lombok.Value;
import java.util.List;

// Generic paginated search response
// Contains list of content and pagination metadata

@Value
@Builder
public class SearchResponse<T> {
    List<T> data;
    PaginationMetadata pagination;
}