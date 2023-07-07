package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String email);
}
