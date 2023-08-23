package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.RegisterRequestDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;
import com.dtahk.pcpartsshop.dtos.UserResponseDto;
import com.dtahk.pcpartsshop.entites.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
        @Mapping(target = "male", source = "sex")
        UserResponseDto userToUserResponseDto(User user);
        @Mapping(target = "password", ignore = true)
        @Mapping(target = "sex", source = "male")
        User userRequestDtoToUser(UserRequestDto userRequestDto);
        UserRequestDto registerDtoToUserRequestDto(RegisterRequestDto registerDto);
//    SignInResponseDto<?> userDtoToUserSignDto(UserResponseDto userDto);

}

