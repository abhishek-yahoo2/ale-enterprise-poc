package com.company.ale.common.pagination;

import lombok.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginationRequest {

    @Min(0)
    private Integer page;

    @Min(1)
    @Max(200)
    private Integer size;

    public int getPageOrDefault() {
        return page != null ? page : 0;
    }

    public int getSizeOrDefault() {
        return size != null ? Math.min(size, 200) : 25;
    }
}
