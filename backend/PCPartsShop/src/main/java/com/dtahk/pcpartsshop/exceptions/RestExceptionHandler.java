package com.dtahk.pcpartsshop.exceptions;

import com.dtahk.pcpartsshop.commons.RespBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class RestExceptionHandler {
    public static final String REQUEST_IS_INVALID = "Required request is invalid";
    public static final String URL_DOES_NOT_EXIST = "Url doesn't exist";
    public static final String ARGS_IS_INVALID = "Args is invalid";
    public static final String ACCESS_DENIED = "Access Denied";

    @ExceptionHandler(value = AppException.class)
    @ResponseBody
    public ResponseEntity<RespBody> handleBusinessException(AppException ex) {
        return ResponseEntity.status(ex.getStatus())
                .body(RespBody.builder()
                        .status(ex.getStatus().value())
                        .message(ex.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<RespBody> handleInvalidArsException(MethodArgumentNotValidException ex){
        Map<String, String> errorMap = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errorMap.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.status(ex.getStatusCode())
                .body(RespBody.builder()
                        .status(ex.getStatusCode().value())
                        .message(ARGS_IS_INVALID)
                        .data(errorMap)
                        .build()
                );
    }

    @ExceptionHandler(value = NoHandlerFoundException.class)
    @ResponseBody
    public ResponseEntity<RespBody> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(RespBody.builder()
                        .status(ex.getStatusCode().value())
                        .message(URL_DOES_NOT_EXIST)
                        .build()
                );
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    @ResponseBody
    public ResponseEntity<RespBody> handleMessageNotReadableException(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RespBody.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message(REQUEST_IS_INVALID)
                        .build()
                );
    }

    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    @ResponseBody
    public ResponseEntity<RespBody> handleHttpRequestMethodNotSupportedEException(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(RespBody.builder()
                        .status(ex.getStatusCode().value())
                        .message(ex.getMessage())
                        .build()
                );
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    @ResponseBody
    public ResponseEntity<RespBody> handleHttpClientErrorException(AccessDeniedException ex){
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(RespBody.builder()
                        .status(HttpStatus.FORBIDDEN.value())
                        .message(ACCESS_DENIED)
                        .build()
                );
    }
}