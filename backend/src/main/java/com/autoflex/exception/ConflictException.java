package com.autoflex.exception;

/**
 * Exception for HTTP 409 Conflict - used when a resource already exists
 * (e.g., duplicate code) or conflicts with current state.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
