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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String username;
    @Size(max=30)
    @NotNull
    private char[] password;
    private boolean active;
    private boolean male;
    @JsonFormat(pattern = "yyyy-MM-dd a HH:mm:ss")
    private LocalDateTime createdAt;
    private String address;
}
