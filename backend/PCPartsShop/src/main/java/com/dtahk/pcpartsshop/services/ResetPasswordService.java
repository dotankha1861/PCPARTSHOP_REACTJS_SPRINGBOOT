package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.PasswordResetDto;
import com.dtahk.pcpartsshop.dtos.ValidateTokenDto;
import jakarta.mail.MessagingException;

public interface ResetPasswordService {
    public void sendResetPasswordToken(String email) throws MessagingException;

    void validateToken(ValidateTokenDto validateTokenDto);

    void resetPassword(PasswordResetDto passwordResetDto);
}
