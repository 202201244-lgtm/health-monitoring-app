package com.example.healthapp.controller;

import com.example.healthapp.model.User;
import com.example.healthapp.repo.UserRepository;
import com.example.healthapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepo;
    private final UserService userService;

    public AdminController(UserRepository userRepo, UserService userService) {
        this.userRepo = userRepo;
        this.userService = userService;
    }

    // ✅ Create a new Doctor
    @PostMapping("/create-doctor")
    public ResponseEntity<?> createDoctor(@RequestBody User input) {
        if (userRepo.existsByEmail(input.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }
        User u = User.builder()
                .name(input.getName())
                .email(input.getEmail())
                .password(input.getPassword())
                .specialization(input.getSpecialization())
                .phone(input.getPhone())
                .build();

        User saved = userService.createDoctor(u);
        return ResponseEntity.ok(Map.of("message", "Doctor created successfully", "userId", saved.getId()));
    }

    // ✅ Create a new Patient
    @PostMapping("/create-patient")
    public ResponseEntity<?> createPatient(@RequestBody User input) {
        if (userRepo.existsByEmail(input.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }
        User u = User.builder()
                .name(input.getName())
                .email(input.getEmail())
                .password(input.getPassword())
                .phone(input.getPhone())
                .build();

        User saved = userService.createPatient(u);
        return ResponseEntity.ok(Map.of("message", "Patient created successfully", "userId", saved.getId()));
    }

    // ✅ Get all Doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(userService.getAllDoctors());
    }

    // ✅ Get all Patients
    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(userService.getAllPatients());
    }

    // ✅ Delete a user (doctor/patient)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (!userRepo.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
