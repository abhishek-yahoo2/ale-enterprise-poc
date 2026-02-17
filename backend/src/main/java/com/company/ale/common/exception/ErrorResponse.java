package com.company.ale.common.exception;

import lombok.Builder;
import lombok.Value;
import java.time.LocalDateTime;

// Standard error response format
// Fields: timestamp, status, error, errorCode, message, path, correlationId
@Value
@Builder
public class ErrorResponse {
    LocalDateTime timestamp;
    int status;
    String error;
    String errorCode;
    String message;
    String path;
    String correlationId; // For tracing across logs
}
