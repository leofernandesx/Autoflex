package com.autoflex.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.eclipse.microprofile.config.ConfigProvider;
import org.jboss.logging.Logger;

import java.util.stream.Collectors;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionHandler.class);
    private static final String GENERIC_ERROR_MESSAGE = "An unexpected error occurred. Please try again later.";

    @Override
    public Response toResponse(Exception exception) {
        LOG.error("Exception caught", exception);

        if (exception instanceof NotFoundException) {
            return handleNotFoundException((NotFoundException) exception);
        } else if (exception instanceof ConflictException) {
            return handleConflictException((ConflictException) exception);
        } else if (exception instanceof IllegalArgumentException) {
            return handleIllegalArgumentException((IllegalArgumentException) exception);
        } else if (exception instanceof ConstraintViolationException) {
            return handleConstraintViolationException((ConstraintViolationException) exception);
        } else {
            return handleGenericException(exception);
        }
    }

    private Response handleNotFoundException(NotFoundException exception) {
        ErrorResponse error = new ErrorResponse(
            Response.Status.NOT_FOUND.getStatusCode(),
            "Resource not found",
            exception.getMessage()
        );
        return Response.status(Response.Status.NOT_FOUND).entity(error).build();
    }

    private Response handleConflictException(ConflictException exception) {
        ErrorResponse error = new ErrorResponse(
            Response.Status.CONFLICT.getStatusCode(),
            "Conflict",
            exception.getMessage()
        );
        return Response.status(Response.Status.CONFLICT).entity(error).build();
    }

    private Response handleIllegalArgumentException(IllegalArgumentException exception) {
        ErrorResponse error = new ErrorResponse(
            Response.Status.BAD_REQUEST.getStatusCode(),
            "Invalid request",
            exception.getMessage()
        );
        return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
    }

    private Response handleConstraintViolationException(ConstraintViolationException exception) {
        String details = exception.getConstraintViolations().stream()
            .map(ConstraintViolation::getMessage)
            .collect(Collectors.joining(", "));
        
        ErrorResponse error = new ErrorResponse(
            Response.Status.BAD_REQUEST.getStatusCode(),
            "Validation failed",
            details
        );
        return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
    }

    private Response handleGenericException(Exception exception) {
        // In production, do not expose internal error details
        String profile = ConfigProvider.getConfig()
            .getOptionalValue("quarkus.profile", String.class)
            .orElse("dev");
        boolean isDev = "dev".equals(profile);
        String details = isDev ? exception.getMessage() : GENERIC_ERROR_MESSAGE;
        
        ErrorResponse error = new ErrorResponse(
            Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
            "Internal server error",
            details
        );
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}
