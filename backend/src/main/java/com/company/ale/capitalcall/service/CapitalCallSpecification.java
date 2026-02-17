package com.company.ale.capitalcall.service;

import com.company.ale.capitalcall.domain.CapitalCall;
import com.company.ale.capitalcall.domain.WorkflowStatus;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * JPA Specification for dynamic CapitalCall queries
 */
public class CapitalCallSpecification implements Specification<CapitalCall> {
    
    private final Map<String, Object> filters;
    
    public CapitalCallSpecification(Map<String, Object> filters) {
        this.filters = filters;
    }
    
    @Override
    public Predicate toPredicate(Root<CapitalCall> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();
        
        if (filters == null || filters.isEmpty()) {
            return cb.conjunction();
        }
        
        for (Map.Entry<String, Object> entry : filters.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            
            if (value == null) {
                continue;
            }
            
            switch (key) {
                case "aleBatchId":
                    predicates.add(cb.like(root.get("aleBatchId"), "%" + value + "%"));
                    break;
                case "toeReference":
                    predicates.add(cb.like(root.get("toeReference"), "%" + value + "%"));
                    break;
                case "workflowStatus":
                    predicates.add(cb.equal(root.get("workflowStatus"), WorkflowStatus.valueOf(value.toString())));
                    break;
                case "clientName":
                    predicates.add(cb.like(cb.lower(root.get("clientName")), "%" + value.toString().toLowerCase() + "%"));
                    break;
                case "fromDate":
                    predicates.add(cb.greaterThanOrEqualTo(root.get("fromDate"), LocalDate.parse(value.toString())));
                    break;
                case "toDate":
                    predicates.add(cb.lessThanOrEqualTo(root.get("toDate"), LocalDate.parse(value.toString())));
                    break;
                case "dayType":
                    if (!value.toString().isEmpty()) {
                        predicates.add(cb.equal(root.get("dayType"), value));
                    }
                    break;
                default:
                    // Ignore unknown filters
                    break;
            }
        }
        
        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
