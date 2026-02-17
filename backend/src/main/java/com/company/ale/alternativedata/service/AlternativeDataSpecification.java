package com.company.ale.alternativedata.service;

import com.company.ale.alternativedata.domain.AlternativeData;
import com.company.ale.alternativedata.domain.DataStatus;
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
 * JPA Specification for dynamic AlternativeData queries
 */
public class AlternativeDataSpecification implements Specification<AlternativeData> {
    
    private final Map<String, Object> filters;
    
    public AlternativeDataSpecification(Map<String, Object> filters) {
        this.filters = filters;
    }
    
    @Override
    public Predicate toPredicate(Root<AlternativeData> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
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
                case "clientName":
                    predicates.add(cb.like(cb.lower(root.get("clientName")), "%" + value.toString().toLowerCase() + "%"));
                    break;
                case "accountNumber":
                    predicates.add(cb.like(root.get("accountNumber"), "%" + value + "%"));
                    break;
                case "fundFamily":
                    predicates.add(cb.like(cb.lower(root.get("fundFamily")), "%" + value.toString().toLowerCase() + "%"));
                    break;
                case "dataSource":
                    predicates.add(cb.like(root.get("dataSource"), "%" + value + "%"));
                    break;
                case "reportDate":
                    predicates.add(cb.equal(root.get("reportDate"), LocalDate.parse(value.toString())));
                    break;
                case "status":
                    predicates.add(cb.equal(root.get("status"), DataStatus.valueOf(value.toString())));
                    break;
                default:
                    // Ignore unknown filters
                    break;
            }
        }
        
        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
