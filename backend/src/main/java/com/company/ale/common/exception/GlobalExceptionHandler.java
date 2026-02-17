package com.company.ale.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.MDC;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

// Global exception handler for all REST controllers
// Handles ValidationException, EntityNotFoundException, AuthorizationException
// Returns ErrorResponse with proper HTTP status codes
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Handle ValidationException - return 400 with error code
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            ValidationException ex, HttpServletRequest request) {
        log.warn("Validation error: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Bad Request")
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .correlationId(MDC.get("correlationId"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Handle EntityNotFoundException - return 404
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            EntityNotFoundException ex, HttpServletRequest request) {
        log.warn("Entity not found: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error("Not Found")
                .errorCode("ENTITY_NOT_FOUND")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .correlationId(MDC.get("correlationId"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Handle AuthorizationException - return 403
    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
            AuthorizationException ex, HttpServletRequest request) {
        log.warn("Unauthorized access: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error("Forbidden")
                .errorCode("ACCESS_DENIED")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .correlationId(MDC.get("correlationId"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // Handle generic exceptions - return 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex, HttpServletRequest request) {
        log.error("Internal server error: {}", ex.getMessage(), ex);
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .errorCode("INTERNAL_ERROR")
                .message("An unexpected error occurred")
                .path(request.getRequestURI())
                .correlationId(MDC.get("correlationId"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
