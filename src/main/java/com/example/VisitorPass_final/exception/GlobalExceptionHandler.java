package com.example.VisitorPass_final.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Error", message);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException exception) {
        String message = exception.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining("; "));
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Error", message);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException exception) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Error", exception.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException exception) {
        return buildResponse(HttpStatus.NOT_FOUND, "Resource Not Found", exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", exception.getMessage());
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String error, String message) {
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now().toString(),
                status.value(),
                error,
                message
        );
        return ResponseEntity.status(status).body(response);
    }

    public record ErrorResponse(String timestamp, int status, String error, String message) {
    }
}
