package com.example.healthapp.controller;

import com.example.healthapp.model.TestModel;
import com.example.healthapp.repo.TestRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    private final TestRepository testRepository;

    public TestController(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @GetMapping("/test")
    public String saveTest() {
        testRepository.save(new TestModel("MongoDB connection working!"));
        return "✅ MongoDB connected successfully!";
    }
}
