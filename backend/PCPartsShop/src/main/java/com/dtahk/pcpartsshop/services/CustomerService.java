package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.CategoryUpdateRequestDto;
import com.dtahk.pcpartsshop.dtos.CustomerRequestDto;
import com.dtahk.pcpartsshop.dtos.CustomerResponseDto;
import com.dtahk.pcpartsshop.dtos.CustomerUpdateRequestDto;
import com.dtahk.pcpartsshop.entites.Customer;

import java.util.List;

public interface CustomerService {
    public Customer getCustomerByUserId(Long id);
    public CustomerResponseDto createCustomer(CustomerRequestDto customerRequestDto);
    public List<CustomerResponseDto> getAllCustomer();

    CustomerResponseDto updateCustomer(CustomerUpdateRequestDto customerUpdateRequestDto);

    void activeCustomer(Long customerId, Boolean active);

    void deleteCustomer(Long customerId);
}
