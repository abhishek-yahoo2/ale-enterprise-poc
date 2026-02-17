package com.company.ale.documenttracker.service;

import com.company.ale.documenttracker.domain.DocumentTracker;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * JPA Specification for dynamic DocumentTracker queries based on filters
 */
public class DocumentTrackerSpecification implements Specification<DocumentTracker> {

    private final Map<String, Object> filters;

    public DocumentTrackerSpecification(Map<String, Object> filters) {
        this.filters = filters;
    }

    @Override
    public Predicate toPredicate(Root<DocumentTracker> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb) {

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

            // Ignore blank strings
            if (value instanceof String str && str.isBlank()) {
                continue;
            }

            switch (key) {

                case "genId":
                    predicates.add(
                            cb.like(
                                    cb.lower(root.get("genId")),
                                    "%" + value.toString().toLowerCase() + "%"));
                    break;

                case "documentType":
                    predicates.add(
                            cb.equal(root.get("documentType"), value));
                    break;

                case "createdBy":
                    predicates.add(
                            cb.equal(root.get("createdBy"), value));
                    break;

                default:
                    break;
            }
        }

        return predicates.isEmpty()
                ? cb.conjunction()
                : cb.and(predicates.toArray(new Predicate[0]));
    }

}
