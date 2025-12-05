package com.example.healthapp.repo;

import com.example.healthapp.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // find users by role (you already added this earlier)
    List<User> findByRole(String role);

    // NEW: find patients assigned to a doctor
    List<User> findByAssignedDoctorId(String assignedDoctorId);
}
