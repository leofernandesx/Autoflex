package com.autoflex.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

import java.util.stream.Collectors;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionHandler.class);

    @Override
    public Response toResponse(Exception exception) {
        LOG.error("Exception caught", exception);

        if (exception instanceof NotFoundException) {
            return handleNotFoundException((NotFoundException) exception);
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
        ErrorResponse error = new ErrorResponse(
            Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
            "Internal server error",
            exception.getMessage()
        );
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }
}
