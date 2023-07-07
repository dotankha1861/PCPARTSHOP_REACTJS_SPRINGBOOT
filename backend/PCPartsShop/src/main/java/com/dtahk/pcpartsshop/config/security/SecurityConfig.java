package com.dtahk.pcpartsshop.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final CustomAuthenticationEntryPoint userAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler userAccessDeniedHandler;
    private final AuthenticationProvider userAuthenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(new JwtAuthFilter(userAuthenticationProvider), BasicAuthenticationFilter.class)
                .exceptionHandling(customizer -> customizer.authenticationEntryPoint(userAuthenticationEntryPoint))
                .exceptionHandling(customizer -> customizer.accessDeniedHandler(userAccessDeniedHandler))
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(requests -> requests
                        //Authentication
                        .requestMatchers(HttpMethod.POST, "/signin","/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/signout").authenticated()
                        //User
                        .requestMatchers(HttpMethod.POST, "/users").hasRole("ADMIN")
                        //Urls not exist
                        .anyRequest().permitAll());
        return http.build();
    }
}
