package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
}
