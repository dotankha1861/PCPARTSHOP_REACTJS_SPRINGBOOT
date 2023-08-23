package com.dtahk.pcpartsshop.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class CustomerUpdateRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private boolean male;
}
