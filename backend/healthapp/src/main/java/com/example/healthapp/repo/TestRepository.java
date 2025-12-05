package com.example.healthapp.repo;


import com.example.healthapp.model.TestModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestRepository extends MongoRepository<TestModel, String> {}
