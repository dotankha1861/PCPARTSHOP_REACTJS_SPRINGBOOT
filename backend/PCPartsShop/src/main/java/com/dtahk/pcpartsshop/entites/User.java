package com.dtahk.pcpartsshop.entites;

import com.dtahk.pcpartsshop.commons.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, unique = true, nullable = false)
    private String username;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    @Column(name = "first_name", length = 20, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false)
    private boolean sex;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private UserRole role;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name="created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(pattern = "hh/mm/ss dd/MM/yyyy")
    private LocalDateTime createdAt;

}
