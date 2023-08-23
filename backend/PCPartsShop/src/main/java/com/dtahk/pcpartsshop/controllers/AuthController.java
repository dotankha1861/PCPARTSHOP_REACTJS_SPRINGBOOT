package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.services.AuthService;
import com.dtahk.pcpartsshop.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RequiredArgsConstructor
@RestController
@Slf4j
public class AuthController {
    public static final String LOGIN_SUCCESSFULLY = "Login successfully";
    public static final String CREATE_SUCCESSFULLY_USER = "Create successfully user ";
    private static final String LOGOUT_SUCCESSFULLY = "Logout successfully";
    public static final String CHANGE_PASSWORD_SUCCESSFULLY = "CHANGE_PASSWORD_SUCCESSFULLY";
    private final AuthService authService;

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RespBody> register(@RequestBody RegisterRequestDto registerDto) {
        CustomerResponseDto customerResponseDto = authService.register(registerDto);
        return ResponseEntity.created(URI.create("/customers/" + customerResponseDto.getCustomerId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_SUCCESSFULLY_USER + customerResponseDto.getCustomerId())
                        .data(customerResponseDto)
                        .build()
                );
    }

    @PostMapping("/signin")
    public ResponseEntity<RespBody> signIn(@RequestBody @Valid SignInRequestDto signInDto) {
        SignInResponseDto<?> userSignInDto = authService.signIn(signInDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(LOGIN_SUCCESSFULLY)
                .data(userSignInDto)
                .build()
        );
    }

    @PostMapping("/signout")
    public ResponseEntity<RespBody> signOut() {
        authService.signOut();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(LOGOUT_SUCCESSFULLY)
                .data(null)
                .build()
        );
    }

    @PostMapping("/password")
    public ResponseEntity<RespBody> changePassword(@RequestBody @Valid ChangePasswordRequestDto changePasswordRequestDto){
        userService.changePassword(changePasswordRequestDto);
        return  ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(CHANGE_PASSWORD_SUCCESSFULLY)
                .build()
        );
    }
}
