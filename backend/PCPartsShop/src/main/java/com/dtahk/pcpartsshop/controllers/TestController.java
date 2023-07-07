package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.entites.Test;
import com.dtahk.pcpartsshop.services.impl.TestServiceImpl;
import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class TestController {
    private final TestServiceImpl testService;

    @GetMapping("/test")
    public ResponseEntity<RespBody> getAll(){
        List<Test> testList = testService.getAll();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message("OK")
                .data(testList)
                .build());
    }
}
