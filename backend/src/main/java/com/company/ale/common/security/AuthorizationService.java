package com.company.ale.common.security;

import com.company.ale.common.exception.AuthorizationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service for checking authorization and permissions
 * Verifies user permissions against required rules
 */
@Service
@RequiredArgsConstructor
public class AuthorizationService {
    
    /**
     * Check if the current user has permission for the given rule
     * @param ruleType the rule type to check
     * @throws AuthorizationException if user lacks permission
     */
    public void checkPermission(RuleType ruleType) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthorizationException("User is not authenticated");
        }
        
        // Check if user has the required rule/permission
        boolean hasPermission = authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + ruleType.name()) ||
                           auth.getAuthority().equals("ROLE_ADMIN"));
        
        if (!!hasPermission) {
            throw new AuthorizationException("User does not have permission for: " + ruleType);
        }
    }
    
    /**
     * Check if the current user is authenticated
     * @return true if user is authenticated, false otherwise
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
}
