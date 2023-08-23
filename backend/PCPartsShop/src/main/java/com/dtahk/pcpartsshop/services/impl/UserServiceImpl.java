package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.ChangePasswordRequestDto;
import com.dtahk.pcpartsshop.dtos.SignInRequestDto;
import com.dtahk.pcpartsshop.dtos.UserResponseDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.UserMapper;
import com.dtahk.pcpartsshop.repositories.UserRepository;
import com.dtahk.pcpartsshop.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    public static final String USER_ALREADY_EXISTS = "Người dùng đã tồn tại";
    public static final String USER_DOES_NOT_EXIST = "Người dùng không tồn tại";
    public static final String EMAIL_NOT_EXISTS = "Email không tồn tại";
    public static final String PASSWORD_NOT_CORRECT = "Mật khẩu hiện tại không chính xác";
    public static final String EMAIL_ALREADY_EXIST = "Email này đã được sử dụng";
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public User getUserByUsername(String username){
        Optional<User> optionalUser = userRepository.findByUsername(username);
        throwIfUserNotExists(optionalUser);
        return optionalUser.get();
    }

    public User getUserById(Long id){
        Optional<User> optionalUser = userRepository.findById(id);
        throwIfUserNotExists(optionalUser);
        return optionalUser.get();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    throw new AppException(EMAIL_NOT_EXISTS, HttpStatus.NOT_FOUND);
                });
    }

    public User createUser(UserRequestDto userRequestDto){
        Optional<User> optionalUser = userRepository.findByUsername(userRequestDto.getUsername());
        throwIfUserAlreadyExists(optionalUser);
        if(userRepository.existsByEmail(userRequestDto.getEmail()))
            throw new AppException(EMAIL_ALREADY_EXIST, HttpStatus.FOUND);
        User user = userMapper.userRequestDtoToUser(userRequestDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userRequestDto.getPassword())));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        return userRepository.save(user);
    }

    public UserResponseDto updateUser(UserRequestDto userRequestDto){
//        Optional<User> optionalUser = userRepository.findByUsername(userRequestDto.getUsername());
//        throwIfUserNotExists(optionalUser);
        return new UserResponseDto();
    }

    public boolean checkPasswordUser(SignInRequestDto signInDto){
        Optional<User> optionalUser = userRepository.findByUsername(signInDto.getUsername());
        throwIfUserNotExists(optionalUser);
        User foundUser = optionalUser.get();
        return passwordEncoder.matches(CharBuffer.wrap(signInDto.getPassword()), foundUser.getPassword());
    }

    @Override
    public void changePassword(ChangePasswordRequestDto changePasswordRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Optional<User> optionalUser = userRepository.findById(user.getId());
        throwIfUserNotExists(optionalUser);
        User userFound = optionalUser.get();
        if(!passwordEncoder.matches(CharBuffer.wrap(changePasswordRequestDto.getCrtPassword()), userFound.getPassword()))
            throw new AppException(PASSWORD_NOT_CORRECT, HttpStatus.EXPECTATION_FAILED);
        userFound.setPassword(passwordEncoder.encode(CharBuffer.wrap(changePasswordRequestDto.getNewPassword())));
        userRepository.save(userFound);
    }

    @Override
    public void resetPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(newPassword)));
        userRepository.save(user);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
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
