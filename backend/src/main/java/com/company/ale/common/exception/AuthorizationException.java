package com.company.ale.common.exception;

/**
 * Exception thrown when user lacks required authorization/permissions
 */
public class AuthorizationException extends RuntimeException {
    
    private static final String ERROR_CODE = "ACCESS_DENIED";
    
    public AuthorizationException(String message) {
        super(message);
    }
    
    public AuthorizationException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public String getErrorCode() {
        return ERROR_CODE;
    }
}
