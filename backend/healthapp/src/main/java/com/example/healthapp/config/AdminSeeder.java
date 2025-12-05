package com.example.healthapp.config;

import com.example.healthapp.model.Role;
import com.example.healthapp.model.User;
import com.example.healthapp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepo, BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepo.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name("Admin")
                    .email(adminEmail)
                    .password(encoder.encode(adminPassword))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepo.save(admin);
            System.out.println("Admin user created: " + adminEmail);
        } else {
            System.out.println("Admin user already exists: " + adminEmail);
        }
    }
}
