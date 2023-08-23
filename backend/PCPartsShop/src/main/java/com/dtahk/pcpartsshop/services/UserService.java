package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.ChangePasswordRequestDto;
import com.dtahk.pcpartsshop.dtos.SignInRequestDto;
import com.dtahk.pcpartsshop.dtos.UserResponseDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;
import com.dtahk.pcpartsshop.entites.User;

public interface UserService {
    public User getUserByUsername(String username);

    public User getUserByEmail(String email);
    public User createUser(UserRequestDto userRequestDto);
    public boolean checkPasswordUser(SignInRequestDto signInDto);
    public void changePassword(ChangePasswordRequestDto changePasswordRequestDto);

    void resetPassword(User user, String newPassword);

    User save(User user);

    UserResponseDto updateUser(UserRequestDto userRequestDto);
}
