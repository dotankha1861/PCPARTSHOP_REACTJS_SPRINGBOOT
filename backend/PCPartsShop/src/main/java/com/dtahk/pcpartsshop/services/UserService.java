package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.SignInDto;
import com.dtahk.pcpartsshop.dtos.UserDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;

public interface UserService {
    public UserDto getUserByUsername(String username);
    public UserDto createUser(UserRequestDto userRequestDto);
    public boolean checkPasswordUser(SignInDto signInDto);
}
