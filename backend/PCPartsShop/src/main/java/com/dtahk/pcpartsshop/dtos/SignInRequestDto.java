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
public class SignInRequestDto {
    @NotNull
    @Size(max=30)
    private String username;

    @NotNull
    @Size(max=30)
    private char[] password;
}