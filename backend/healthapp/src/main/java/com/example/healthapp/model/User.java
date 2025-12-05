package com.example.healthapp.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password; // hashed
    private Role role;
    private String specialization; // optional, for doctors
    private String assignedDoctorId;
    private String phone;
}
