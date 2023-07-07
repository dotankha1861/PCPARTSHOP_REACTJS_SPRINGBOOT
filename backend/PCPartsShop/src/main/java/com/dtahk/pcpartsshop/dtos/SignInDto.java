package com.dtahk.pcpartsshop.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignInDto {
    @NotNull
    @Size(min=5, max=20)
    private String username;

    @NotNull
    @Size(min=5, max = 20)
    private char[] password;
}