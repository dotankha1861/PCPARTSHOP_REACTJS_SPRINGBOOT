package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "customerId", source = "id")
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
    CustomerResponseDto customerToCustomerResponseDto(Customer customer);
    UserRequestDto customerRequestDtoToUserRequestDto(CustomerRequestDto customerRequestDtoDto);
    Customer customerRequestDtoToCustomer(CustomerRequestDto customerRequestDto);
    Customer customerUpdateRequestDtoToCustomer(CustomerUpdateRequestDto customerUpdateRequestDto);
    CustomerRequestDto registerRequestDtoToCustomerRequestDto(RegisterRequestDto registerRequestDto);
}
