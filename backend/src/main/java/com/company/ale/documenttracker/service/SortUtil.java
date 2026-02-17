package com.company.ale.documenttracker.service;

import com.company.ale.common.pagination.SortRequest;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for converting SortRequest to Sort objects
 */
public class SortUtil {
    
    /**
     * Convert a list of SortRequest objects to a Sort object
     * @param sortRequests the sort requests to convert
     * @return the Sort object
     */
    public static Sort toSort(List<SortRequest> sortRequests) {
        if (sortRequests == null || sortRequests.isEmpty()) {
            return Sort.unsorted();
        }
        
        List<Sort.Order> orders = sortRequests.stream()
            .map(sr -> new Sort.Order(sr.getDirection(), sr.getField()))
            .collect(Collectors.toList());
        
        return Sort.by(orders);
    }
}
