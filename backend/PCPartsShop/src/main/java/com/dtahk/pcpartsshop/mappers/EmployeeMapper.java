package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.repositories.EmployeeRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    @Mapping(target = "employeeId", source = "id")
    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "active", source = "user.active")
    @Mapping(target = "male", source = "user.sex")
    @Mapping(target = "role", source = "user.role")
    @Mapping(target = "createdAt", source = "user.createdAt")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "createrId", source = "employee.id")
    EmployeeResponseDto employeeToEmployeeResponseDto(Employee employee);

    UserRequestDto employeeRequestDtoToUserRequestDto(EmployeeRequestDto employeeRequestDto);
    Employee employeeRequestDtoToEmployee(EmployeeRequestDto employeeRequestDto);

    UserRequestDto profileEmployeeRequestDtoToUserRequestDto (ProfileEmployeeRequestDto profileEmployeeRequestDto);
}
