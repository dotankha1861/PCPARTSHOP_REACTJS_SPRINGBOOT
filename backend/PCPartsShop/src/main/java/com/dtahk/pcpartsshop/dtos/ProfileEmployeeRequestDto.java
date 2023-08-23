package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ProfileEmployeeRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private boolean male;
    private UserRole role;
    private MultipartFile image;
}
