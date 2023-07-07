package com.dtahk.pcpartsshop.config.security;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    public static final String NO_ACCESS_PERMISSION = "No access permission";

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        OBJECT_MAPPER.writeValue(
                response.getOutputStream(),
                RespBody.builder()
                        .status(HttpStatus.FORBIDDEN.value())
                        .message(NO_ACCESS_PERMISSION)
                        .build()
        );
    }
}
