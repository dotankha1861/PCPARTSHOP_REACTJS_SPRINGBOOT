package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.*;

public interface AuthService {
    public CustomerResponseDto register(RegisterRequestDto registerDto);
    public SignInResponseDto signIn(SignInRequestDto signInDto);
    public void signOut();
}
