package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.UserDto;
import com.dtahk.pcpartsshop.dtos.UserRequestDto;
import com.dtahk.pcpartsshop.services.UserService;
import com.dtahk.pcpartsshop.services.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URI;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    public static final String CREATE_USER_SUCCESSFULLY = "CREATE USER SUCCESSFULLY";
    private final UserService userService;

//    @PostMapping
//    public ResponseEntity<RespBody> changePassword(@RequestBody @Valid UserRequestDto userRequestDto){
//        UserDto userDto = userService.checkPasswordUser()
//    }

    @PostMapping
    public ResponseEntity<RespBody> createUser(@RequestBody @Valid UserRequestDto userRequestDto){
        UserDto userDto = userService.createUser(userRequestDto);
        return ResponseEntity.created(URI.create("/users/id" + userDto.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_USER_SUCCESSFULLY)
                        .data(userDto)
                        .build()
                );
    }
//
//    @PutMapping
//    public ResponseEntity<RespBody> updateUser(@RequestBody @Valid UserRequestDto userRequestDto){
//        UserDto userDto = userService.updateUser(userRequestDto);
//        return userDto = userService
//    }
}
