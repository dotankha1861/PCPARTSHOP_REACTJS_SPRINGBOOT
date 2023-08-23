package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.dtahk.pcpartsshop.dtos.CustomerRequestDto;
import com.dtahk.pcpartsshop.dtos.CustomerResponseDto;
import com.dtahk.pcpartsshop.dtos.CustomerUpdateRequestDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;
import com.dtahk.pcpartsshop.entites.Customer;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.CustomerMapper;
import com.dtahk.pcpartsshop.repositories.CustomerRepository;
import com.dtahk.pcpartsshop.services.CustomerService;
import com.dtahk.pcpartsshop.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    public static final String CUSTOMER_NOT_EXIST = "Khách hàng không tồn tại";
    public static final String CUSTOMER_HAS_ORDER = "Khách hàng đã đặt đơn hàng";
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserService userService;

    @Override
    public Customer getCustomerByUserId(Long id) {
        Optional<Customer> customer = customerRepository.findByUserId(id);
        throwIfCustomerNotExist(customer);
        return customer.get();
    }

    @Override
    @Transactional
    public CustomerResponseDto createCustomer(CustomerRequestDto customerRequestDto) {
        UserRequestDto userRequestDto = customerMapper.customerRequestDtoToUserRequestDto(customerRequestDto);
        log.error(userRequestDto.toString());
        userRequestDto.setRole(UserRole.CUSTOMER);
        User user = userService.createUser(userRequestDto);
        Customer customer = customerMapper.customerRequestDtoToCustomer(customerRequestDto);
        customer.setUser(user);
        Customer saveCustomer = customerRepository.save(customer);
        return customerMapper.customerToCustomerResponseDto(saveCustomer);
    }

    @Override
    public List<CustomerResponseDto> getAllCustomer() {
        List<Customer> customerList = customerRepository.findAll(Sort.by(Sort.Direction.DESC,"user.createdAt"));
        return customerList.stream()
                .map(customerMapper::customerToCustomerResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CustomerResponseDto updateCustomer(CustomerUpdateRequestDto customerUpdateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Customer customer = customerRepository.findByUserId(user.getId()).orElseThrow(() -> {
            throw new AppException(CUSTOMER_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        user.setFirstName(customerUpdateRequestDto.getFirstName());
        user.setLastName(customerUpdateRequestDto.getLastName());
        user.setEmail(customerUpdateRequestDto.getEmail());
        user.setPhone(customerUpdateRequestDto.getPhone());
        user.setSex(customerUpdateRequestDto.isMale());
        userService.save(user);

        customer.setUser(user);
        customer.setAddress(customerUpdateRequestDto.getAddress());
        customerRepository.save(customer);

        return customerMapper.customerToCustomerResponseDto(customer);
    }

    @Override
    public void activeCustomer(Long customerId, Boolean active) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> {
            throw new AppException(CUSTOMER_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        User user = customer.getUser();
        user.setActive(active);
        userService.save(user);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> {
            throw new AppException(CUSTOMER_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        if(customer.getListOrders().isEmpty()) {
            log.info(customerId.toString());
            customerRepository.deleteById(customerId);
        }
        else throw new AppException(CUSTOMER_HAS_ORDER, HttpStatus.EXPECTATION_FAILED);
    }

    private static void throwIfCustomerNotExist(Optional<Customer> customer) {
        if(customer.isEmpty()) throw new AppException(CUSTOMER_NOT_EXIST, HttpStatus.NOT_FOUND);
    }
}
