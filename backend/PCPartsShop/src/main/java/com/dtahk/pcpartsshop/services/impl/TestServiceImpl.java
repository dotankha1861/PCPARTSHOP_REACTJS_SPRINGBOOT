package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.entites.Test;
import com.dtahk.pcpartsshop.repositories.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TestServiceImpl {
    private final TestRepository testRepository;

    public List<Test> getAll(){
        return testRepository.findAll();
    }
}
