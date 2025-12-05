package com.example.healthapp.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private String expectedRole; // "ADMIN", "DOCTOR", or "PATIENT"
}
