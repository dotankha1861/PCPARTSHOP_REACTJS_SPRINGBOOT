package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.services.AuthService;
import com.dtahk.pcpartsshop.services.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RequiredArgsConstructor
@RestController
public class AuthController {
    public static final String LOGIN_SUCCESSFULLY = "Login successfully";
    public static final String CREATE_SUCCESSFULLY_USER = "Create successfully user ";
    private static final String LOGOUT_SUCCESSFULLY ="Logout successfully" ;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RespBody> register(@RequestBody RegisterDto registerDto) {
        UserDto userDto = authService.register(registerDto);
        return ResponseEntity.created(URI.create("/users/" + userDto.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_SUCCESSFULLY_USER + userDto.getId())
                        .data(userDto)
                        .build()
                );
    }

    @PostMapping("/signin")
    public ResponseEntity<RespBody> signIn(@RequestBody @Valid SignInDto signInDto) {
        UserSignInDto userSignInDto = authService.signIn(signInDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(LOGIN_SUCCESSFULLY)
                .data(userSignInDto)
                .build()
        );
    }

    @PostMapping("/signout")
    public ResponseEntity<RespBody> signOut(){
        authService.signOut();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(LOGOUT_SUCCESSFULLY)
                .data(null)
                .build()
        );
    }
}
