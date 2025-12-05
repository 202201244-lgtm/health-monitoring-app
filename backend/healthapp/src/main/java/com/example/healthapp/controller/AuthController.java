package com.example.healthapp.controller;

import com.example.healthapp.dto.LoginRequest;
import com.example.healthapp.dto.RegisterRequest;
import com.example.healthapp.model.User;
import com.example.healthapp.repo.UserRepository;
import com.example.healthapp.security.JwtUtil;
import com.example.healthapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder;

    public AuthController(UserRepository userRepo, UserService userService, JwtUtil jwtUtil, BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
    }

    // Patient self-register
    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(@RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }
        User u = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(req.getPassword())
                .phone(req.getPhone())
                .build();
        User saved = userService.createPatient(u);
        return ResponseEntity.ok(Map.of("message", "Patient registered", "userId", saved.getId()));
    }

    // Login (patients, doctors, admin)
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
//        var opt = userRepo.findByEmail(req.getEmail());
//        if (opt.isEmpty()) return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
//
//        User user = opt.get();
//        if (!encoder.matches(req.getPassword(), user.getPassword()))
//            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
//
//        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
//        return ResponseEntity.ok(Map.of(
//                "token", token,
//                "userId", user.getId(),
//                "role", user.getRole().name(),
//                "name", user.getName()
//        ));
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        var opt = userRepo.findByEmail(req.getEmail());
        if (opt.isEmpty())
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));

        User user = opt.get();

        if (!encoder.matches(req.getPassword(), user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));

        // 🔹 Role validation
        if (req.getExpectedRole() != null && !user.getRole().name().equalsIgnoreCase(req.getExpectedRole())) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized role access"));
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", user.getId(),
                "role", user.getRole().name(),
                "name", user.getName()
        ));
    }


}
