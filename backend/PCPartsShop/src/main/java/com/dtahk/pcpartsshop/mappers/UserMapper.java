package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.RegisterDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;
import com.dtahk.pcpartsshop.dtos.UserSignInDto;
import com.dtahk.pcpartsshop.dtos.UserDto;
import com.dtahk.pcpartsshop.entites.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto userToUserDto(User user);
    UserRequestDto registerDtoToUserRequestDto(RegisterDto registerDto);
    UserSignInDto userDtoToUserSignDto(UserDto userDto);
    @Mapping(target = "password", ignore = true)
    User userRequestDtoToUser(UserRequestDto userRequestDto);
}
