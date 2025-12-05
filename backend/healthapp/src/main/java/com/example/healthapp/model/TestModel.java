package com.example.healthapp.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "test")
public class TestModel {
    @Id
    private String id;
    private String message;

    public TestModel(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
}

