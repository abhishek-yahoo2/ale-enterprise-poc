package com.company.ale.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Custom validation exception with error code
// HTTP Status: 400 Bad Request
@ResponseStatus(HttpStatus.BAD_REQUEST)
@Getter
public class ValidationException extends RuntimeException {
    private final String errorCode;
    
    // Constructor with message and error code
    public ValidationException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    // Constructor with message, error code and cause
    public ValidationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}