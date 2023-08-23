package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.CustomerResponseDto;
import com.dtahk.pcpartsshop.dtos.PasswordResetDto;
import com.dtahk.pcpartsshop.dtos.SignInResponseDto;
import com.dtahk.pcpartsshop.dtos.ValidateTokenDto;
import com.dtahk.pcpartsshop.services.ResetPasswordService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapping;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class ResetPasswordController {
    public static final String SENT_PASSWORD_REST_TOKEN = "Đã gửi token qua email";
    private final ResetPasswordService resetPasswordService;

    @GetMapping("forget-password/{email}")
    public ResponseEntity<RespBody> forgetPassword(@PathVariable String email) throws MessagingException {
        resetPasswordService.sendResetPasswordToken(email);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(SENT_PASSWORD_REST_TOKEN)
                .data(null)
                .build()
        );
    }

    @PostMapping("validate-reset-token")
    public ResponseEntity<RespBody> validateToken(@RequestBody ValidateTokenDto validateTokenDto){
        resetPasswordService.validateToken(validateTokenDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message("OK")
                .build()
        );
    }

    @PostMapping("reset-password")
    public ResponseEntity<RespBody> resetPassword(@RequestBody PasswordResetDto passwordResetDto){
        resetPasswordService.resetPassword(passwordResetDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật mật khẩu thành công")
                .data(null)
                .build()
        );
    }
}
