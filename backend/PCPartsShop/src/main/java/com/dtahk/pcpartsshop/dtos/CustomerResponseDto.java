package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CustomerResponseDto {

    private String customerId;

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String username;

    private boolean active;

    private boolean male;

    private UserRole role;

    private String address;

    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime createdAt;
}
