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
                        .requestMatchers(HttpMethod.POST, "/signout", "/password").authenticated()
                        //Cart
                        .requestMatchers("/carts", "/carts/**").hasRole("CUSTOMER")
                        //Category
                        .requestMatchers(HttpMethod.GET, "/categories").permitAll()
                        .requestMatchers(HttpMethod.POST,"/categories").hasAnyRole("MEMBER","ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/**").hasAnyRole("MEMBER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasAnyRole("MEMBER", "ADMIN")
                        //Customer
                        .requestMatchers(HttpMethod.GET, "/customers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/customers").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/customers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/customers/**").hasRole("ADMIN")
                        //Employee
                        .requestMatchers(HttpMethod.GET, "/admin/employees").hasAnyRole("MENBER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/admin/employees").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/employees").hasAnyRole("MEMBER","ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/employees/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/admin/employees/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/employees/role/**").hasRole("ADMIN")
                        //Image
                        .requestMatchers("/images/**").permitAll()
                        //Order
                        .requestMatchers(HttpMethod.GET, "/orders").hasAnyRole("MEMBER","ADMIN")
                        .requestMatchers(HttpMethod.GET, "/orders/customer").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/orders").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/orders/approve/**", "/orders/status/**").hasAnyRole("MEMBER","ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/orders/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/orders/statistic-revenue").hasRole("ADMIN")
                        //Product
                        .requestMatchers(HttpMethod.GET, "/products", "/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/products").hasAnyRole("MEMBER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/**").hasAnyRole("MEMBER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasAnyRole("MEMBER", "ADMIN")
                        //Promotion
                        .requestMatchers(HttpMethod.GET, "/promotions", "/promotions/**").hasAnyRole("MEMBER", "ADMIN")
                        .requestMatchers(HttpMethod.POST,"/promotions").hasAnyRole("MEMBER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/promotions/**","/promotions/cancel/**").hasAnyRole("MEMBER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/promotions/**").hasAnyRole("MEMBER", "ADMIN")
                        //Reset Password
                        .requestMatchers(HttpMethod.GET, "/forget-password/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/validate-reset-token").permitAll()
                        .requestMatchers(HttpMethod.POST, "/reset-password").permitAll()
                        //Stock Inventory Sheet
                        .requestMatchers(HttpMethod.GET, "/stock-inventory-sheet","/stock-inventory-sheet/**").hasAnyRole("MEMBER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/stock-inventory-sheet").hasAnyRole("MEMBER", "ADMIN")
//                      //Urls not exist
                        .anyRequest().permitAll());
        return http.build();
    }
}
