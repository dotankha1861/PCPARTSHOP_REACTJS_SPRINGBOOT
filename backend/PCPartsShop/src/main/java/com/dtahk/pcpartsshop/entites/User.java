package com.dtahk.pcpartsshop.entites;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.fasterxml.jackson.databind.annotation.EnumNaming;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    @Size(max = 20)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    @Size(max = 50)
    private String lastName;

    @Column(nullable = false)
    @Size(max = 100)
    private String email;

    @Column(nullable = false)
    @Size(min=5, max=20)
    private String username;

    @Column(nullable = false)
    @Size(max=120)
    private String password;

    @Column(nullable = false)
    private Boolean enabled;

    @Enumerated(EnumType.STRING)
    private UserRole role;

}
