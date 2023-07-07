package com.dtahk.pcpartsshop.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    public final String TOKEN_TYPE = "Bearer";
    private final AuthenticationProvider userAuthenticationProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null) {
            String[] authElements = header.split(" ");

            if (authElements.length == 2
                    && TOKEN_TYPE.equals(authElements[0])) {
                try {
                    if ("GET".equals(request.getMethod())) {
                        SecurityContextHolder.getContext().setAuthentication(
                                userAuthenticationProvider.validateToken(authElements[1]));
                    } else {
                        SecurityContextHolder.getContext().setAuthentication(
                                userAuthenticationProvider.validateTokenStrongly(authElements[1]));
                    }
                }
                catch (RuntimeException e) {
                    SecurityContextHolder.clearContext();
                    log.warn(e.getMessage());
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
