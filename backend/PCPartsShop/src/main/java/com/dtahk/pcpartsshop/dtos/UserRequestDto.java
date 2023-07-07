package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.UserRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class UserRequestDto {
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
    @Size(min=5, max=20)
    private String username;

    @NotNull
    @Size(min=5, max=20)
    private char[] password;

    @NotNull
    @Enumerated(EnumType.STRING)
    private UserRole role;
}
