package com.dtahk.pcpartsshop.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequestDto {
    @NotNull
    @NotBlank
    @Size(max = 20)
    private String firstName;

    @NotNull
    @NotBlank
    @Size(max = 50)
    private String lastName;

    @NotNull
    @Email
    @NotBlank
    @Size(max = 100)
    private String email;

    @NotNull
    @NotBlank
    private boolean male;

    private String phone;

    @NotNull
    @Size(max=30)
    private String username;

    @NotNull
    @Size(max=30)
    private char[] password;
}
