package com.dtahk.pcpartsshop.dtos;

import lombok.Data;

@Data
public class PasswordResetDto {
    private String token;
    private String newPassword;
}
