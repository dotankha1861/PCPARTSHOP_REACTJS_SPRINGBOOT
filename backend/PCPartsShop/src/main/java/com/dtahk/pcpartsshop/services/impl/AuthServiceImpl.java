package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.dtahk.pcpartsshop.config.security.AuthenticationProvider;
import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Customer;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.CustomerMapper;
import com.dtahk.pcpartsshop.mappers.EmployeeMapper;
import com.dtahk.pcpartsshop.mappers.UserMapper;
import com.dtahk.pcpartsshop.services.AuthService;
import com.dtahk.pcpartsshop.services.CustomerService;
import com.dtahk.pcpartsshop.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {
    public static final String PASSWORD_IS_INCORRECT = "Mật khẩu không chính xác";
    public static final String USER_ALREADY_BLOCKED = "Tài khoản này đã bị khoá";
    private final UserServiceImpl userService;
    private final UserMapper userMapper;
    private final EmployeeMapper employeeMapper;
    private final AuthenticationProvider userAuthenticationProvider;
    private final EmployeeService employeeService;
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

    public CustomerResponseDto register(RegisterRequestDto registerDto) {
        UserRequestDto userRequestDto = userMapper.registerDtoToUserRequestDto(registerDto);
        log.error(userRequestDto.toString());
        userRequestDto.setRole(UserRole.CUSTOMER);
        CustomerRequestDto customerRequestDto = customerMapper
                .registerRequestDtoToCustomerRequestDto(registerDto);
        log.error(customerRequestDto.toString());
        return customerService.createCustomer(customerRequestDto);
    }

    public SignInResponseDto<Object> signIn(SignInRequestDto signInDto) {
        throwIfPasswordIsIncorrect(signInDto);
        User user = userService.getUserByUsername(signInDto.getUsername());
        if(!user.isActive()) throw new AppException(USER_ALREADY_BLOCKED, HttpStatus.EXPECTATION_FAILED);
        SignInResponseDto<Object> signInResponseDto = new SignInResponseDto<>();
        signInResponseDto.setToken(userAuthenticationProvider.createToken(
                userMapper.userToUserResponseDto(user)
        ));
        if(user.getRole().equals(UserRole.CUSTOMER)){
            Customer customer = customerService.getCustomerByUserId(user.getId());
            signInResponseDto.setUserDetail(customerMapper.customerToCustomerResponseDto(customer));
        }
        else{
            Employee employee= employeeService.getEmployeeByUserId(user.getId());
            signInResponseDto.setUserDetail(employeeMapper.employeeToEmployeeResponseDto(employee));
        }
        return signInResponseDto;
    }

    private void throwIfPasswordIsIncorrect(SignInRequestDto signInDto) {
        if(!userService.checkPasswordUser(signInDto)){
            throw new AppException(PASSWORD_IS_INCORRECT, HttpStatus.UNAUTHORIZED);
        }
    }

    public void signOut(){
        SecurityContextHolder.clearContext();
    }

}
