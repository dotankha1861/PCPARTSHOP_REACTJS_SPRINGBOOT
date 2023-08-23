package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.Customer;
import com.dtahk.pcpartsshop.entites.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    boolean existsByEmployeeId(Long employeeId);
}
