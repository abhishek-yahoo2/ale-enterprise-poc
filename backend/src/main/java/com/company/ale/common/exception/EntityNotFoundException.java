package com.company.ale.common.exception;

/**
 * Exception thrown when an entity is not found in the database
 */
public class EntityNotFoundException extends RuntimeException {
    
    private static final String ERROR_CODE = "ENTITY_NOT_FOUND";
    
    public EntityNotFoundException(String message) {
        super(message);
    }
    
    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public String getErrorCode() {
        return ERROR_CODE;
    }
}
