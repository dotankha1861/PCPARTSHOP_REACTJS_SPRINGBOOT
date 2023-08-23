package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResetPasswordRepository extends JpaRepository<PasswordResetToken, Long> {
    public Optional<PasswordResetToken> findByUserId(Long id);

    Optional<PasswordResetToken> findByToken(String token);
}
