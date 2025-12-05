package com.example.healthapp.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // ROLE_DOCTOR or ROLE_PATIENT
    private String phone;
}
