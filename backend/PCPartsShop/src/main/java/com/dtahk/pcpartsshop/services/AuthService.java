package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.RegisterDto;
import com.dtahk.pcpartsshop.dtos.SignInDto;
import com.dtahk.pcpartsshop.dtos.UserDto;
import com.dtahk.pcpartsshop.dtos.UserSignInDto;
import org.springframework.security.core.context.SecurityContextHolder;

public interface AuthService {
    public UserDto register(RegisterDto registerDto);
    public UserSignInDto signIn(SignInDto signInDto);
    public void signOut();
}
