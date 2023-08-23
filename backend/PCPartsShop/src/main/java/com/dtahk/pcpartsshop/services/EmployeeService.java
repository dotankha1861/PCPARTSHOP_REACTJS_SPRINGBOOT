package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Employee;

import java.util.List;

public interface EmployeeService {
    public void deleteEmployee(Long employeeId) ;
    public Employee getEmployeeByUserId(Long id);
    public List<EmployeeResponseDto> getAllEmployee();
    public Employee createEmployee(EmployeeRequestDto employeeRequestDto);


    EmployeeResponseDto updateProfileEmployee(ProfileEmployeeRequestDto profileEmployeeRequestDto);

    void activeEmployee(Long employeeId, Boolean active);

    void updateRole(Long employeeId, UpdateRoleRequestDto updateRoleRequestDto);
}
