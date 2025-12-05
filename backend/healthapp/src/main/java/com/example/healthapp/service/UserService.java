package com.example.healthapp.service;

import com.example.healthapp.model.Role;
import com.example.healthapp.model.User;
import com.example.healthapp.repo.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepository userRepo, BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    // ✅ Create Patient
    public User createPatient(User u) {
        u.setPassword(encoder.encode(u.getPassword()));
        u.setRole(Role.ROLE_PATIENT);
        return userRepo.save(u);
    }

    // ✅ Create Doctor
    public User createDoctor(User u) {
        u.setPassword(encoder.encode(u.getPassword()));
        u.setRole(Role.ROLE_DOCTOR);
        return userRepo.save(u);
    }

    // ✅ Create Admin
    public User createAdmin(User u) {
        u.setPassword(encoder.encode(u.getPassword()));
        u.setRole(Role.ROLE_ADMIN);
        return userRepo.save(u);
    }

    // ✅ Fetch all doctors
    public List<User> getAllDoctors() {
        return userRepo.findByRole("ROLE_DOCTOR");
    }

    // ✅ Fetch all patients
    public List<User> getAllPatients() {
        return userRepo.findByRole("ROLE_PATIENT");
    }

    // ✅ Delete a user (doctor/patient) by ID
    public void deleteUser(String id) {
        userRepo.deleteById(id);
    }
}
