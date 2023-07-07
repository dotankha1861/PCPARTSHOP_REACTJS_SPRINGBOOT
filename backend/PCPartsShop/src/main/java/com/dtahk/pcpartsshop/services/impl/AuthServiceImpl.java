package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.commons.UserRole;
import com.dtahk.pcpartsshop.config.security.AuthenticationProvider;
import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.UserMapper;
import com.dtahk.pcpartsshop.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    public static final String PASSWORD_IS_INCORRECT = "Password is incorrect";
    private final UserServiceImpl userService;
    private final UserMapper userMapper;
    private final AuthenticationProvider userAuthenticationProvider;

    public UserDto register(RegisterDto registerDto) {
        UserRequestDto userRequestDto = userMapper.registerDtoToUserRequestDto(registerDto);
        userRequestDto.setRole(UserRole.USER);
        return userService.createUser(userRequestDto);
    }

    public UserSignInDto signIn(SignInDto signInDto) {
        throwIfPasswordIsIncorrect(signInDto);
        UserDto userDto = userService.getUserByUsername(signInDto.getUsername());
        UserSignInDto userSignInDto = userMapper.userDtoToUserSignDto(userDto);
        userSignInDto.setToken(userAuthenticationProvider.createToken(userDto));
        return userSignInDto;
    }

    public void signOut(){
        SecurityContextHolder.clearContext();
    }

    // throw App exception

    private void throwIfPasswordIsIncorrect(SignInDto signInDto) {
        if(!userService.checkPasswordUser(signInDto)){
            throw new AppException(PASSWORD_IS_INCORRECT, HttpStatus.UNAUTHORIZED);
        }
    }
}
