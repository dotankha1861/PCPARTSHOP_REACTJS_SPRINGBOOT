package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.SignInDto;
import com.dtahk.pcpartsshop.dtos.UserDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.UserMapper;
import com.dtahk.pcpartsshop.repositories.UserRepository;
import com.dtahk.pcpartsshop.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    public static final String USER_ALREADY_EXISTS = "User already exists";
    public static final String USER_DOES_NOT_EXIST = "User doesn't exist";
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public UserDto getUserByUsername(String username){
        Optional<User> optionalUser = userRepository.findByUsername(username);
        throwIfUserNotExists(optionalUser);
        User foundUser = optionalUser.get();
        return userMapper.userToUserDto(foundUser);
    }

    public UserDto createUser(UserRequestDto userRequestDto){
        Optional<User> optionalUser = userRepository.findByUsername(userRequestDto.getUsername());
        throwIfUserAlreadyExists(optionalUser);
        User user = userMapper.userRequestDtoToUser(userRequestDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userRequestDto.getPassword())));
        user.setEnabled(true);
        User savedUser = userRepository.save(user);
        return userMapper.userToUserDto(savedUser);
    }

//    public UserDto updateUser(UserRequestDto userRequestDto){
//        Optional<User> optionalUser = userRepository.findByUsername(userRequestDto.getUsername());
//        throwIfUserNotExists(optionalUser);
//        return
//    }
    public boolean checkPasswordUser(SignInDto signInDto){
        Optional<User> optionalUser = userRepository.findByUsername(signInDto.getUsername());
        throwIfUserNotExists(optionalUser);
        User foundUser = optionalUser.get();
        return passwordEncoder.matches(CharBuffer.wrap(signInDto.getPassword()), foundUser.getPassword());
    }
    private static void throwIfUserAlreadyExists(Optional<User> optionalUser) {
        if(optionalUser.isPresent()){
            throw new AppException(USER_ALREADY_EXISTS, HttpStatus.FOUND);
        }
    }
    private static void throwIfUserNotExists(Optional<User> optionalUser){
        if(optionalUser.isEmpty()){
            throw new AppException(USER_DOES_NOT_EXIST,HttpStatus.NOT_FOUND);
        }
    }
}
