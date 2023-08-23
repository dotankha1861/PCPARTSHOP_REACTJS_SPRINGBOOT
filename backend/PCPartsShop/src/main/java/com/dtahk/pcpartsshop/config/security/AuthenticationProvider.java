package com.dtahk.pcpartsshop.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.dtahk.pcpartsshop.commons.UserRole;
import com.dtahk.pcpartsshop.dtos.UserResponseDto;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.services.impl.UserServiceImpl;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;

@RequiredArgsConstructor
@Component
@Slf4j
public class AuthenticationProvider {
    public static final String STR_FIRST_NAME = "firstName";
    public static final String STR_LAST_NAME = "lastName";
    public static final String STR_ROLE = "role";
    public static final long MILLIS_1_HOUR = 3_600_000L;
    public static final String TOKEN_HAS_EXPIRED = "Token has expired";
    public static final String STR_ID = "id";
    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    private final UserServiceImpl userService;

    @PostConstruct
    protected void init() {
        // this is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(UserResponseDto userDto) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 5*MILLIS_1_HOUR); // 5 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withIssuer(userDto.getUsername())
                .withClaim(STR_ID, String.valueOf(userDto.getId()))
                .withClaim(STR_FIRST_NAME, userDto.getFirstName())
                .withClaim(STR_LAST_NAME, userDto.getLastName())
                .withClaim(STR_ROLE, userDto.getRole().toString())
                .sign(algorithm);
    }

    public Authentication validateToken(String token) {
        DecodedJWT decodedJWT = getDecodedJWT(token);
        throwIfTokenExpired(decodedJWT);
        User user= User.builder()
                .id(Long.valueOf(decodedJWT.getClaim(STR_ID).asString()))
                .username(decodedJWT.getIssuer())
                .firstName(decodedJWT.getClaim(STR_FIRST_NAME).asString())
                .lastName(decodedJWT.getClaim(STR_LAST_NAME).asString())
                .role(UserRole.valueOf(decodedJWT.getClaim(STR_ROLE).asString()))
                .build();
        log.warn(decodedJWT.getClaim(STR_ID).toString());
        return new UsernamePasswordAuthenticationToken(user, null,
                getGrantedAuthorities(user));
    }

    public Authentication validateTokenStrongly(String token) {
        DecodedJWT decodedJWT = getDecodedJWT(token);
        throwIfTokenExpired(decodedJWT);
        User user = userService.getUserByUsername(decodedJWT.getIssuer());
        log.warn(user.toString());
        return new UsernamePasswordAuthenticationToken(user, null,
                getGrantedAuthorities(user));
    }

    public DecodedJWT getDecodedJWT(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public void throwIfTokenExpired(DecodedJWT decodedJWT){
        if(new Date().compareTo(decodedJWT.getExpiresAt()) > 0) {
            throw new AppException(TOKEN_HAS_EXPIRED, HttpStatus.UNAUTHORIZED);
        }
    }

    private List<GrantedAuthority> getGrantedAuthorities(User user) {
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()));
        return grantedAuthorities;
    }
}
