package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String username;

    private boolean active;

    private boolean male;

    private UserRole role;

    private String phone;

    @JsonFormat(pattern = "HH:mm:ss a dd/MM/yyyy")
    private LocalDateTime createdAt;
}
