package com.example.healthapp.controller;

import com.example.healthapp.dto.AssignPatientRequest;
import com.example.healthapp.model.User;
import com.example.healthapp.service.DoctorService;
import com.example.healthapp.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final UserRepository userRepo;

    public DoctorController(DoctorService doctorService, UserRepository userRepo) {
        this.doctorService = doctorService;
        this.userRepo = userRepo;
    }

    /**
     * Assign a patient under current logged-in doctor.
     * Body: { "patientId": "..." }
     * Auth: ROLE_DOCTOR (your SecurityConfig already restricts /api/doctor/** to doctors)
     */
    @PostMapping("/add-patient")
    public ResponseEntity<?> addPatientUnderMe(@RequestBody AssignPatientRequest req, Authentication authentication) {
        // authentication.getPrincipal() should be userId (because JwtFilter set principal to userId)
        String doctorId = (String) authentication.getPrincipal();

        try {
            User updated = doctorService.assignPatientToDoctor(doctorId, req.getPatientId());
            return ResponseEntity.ok(Map.of("message", "Patient assigned", "patientId", updated.getId()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error"));
        }
    }

    @DeleteMapping("/remove-patient/{patientId}")
    public ResponseEntity<?> removePatientUnderMe(@PathVariable String patientId, Authentication authentication) {
        String doctorId = (String) authentication.getPrincipal();

        try {
            User updated = doctorService.removePatientFromDoctor(doctorId, patientId);
            return ResponseEntity.ok(Map.of(
                    "message", "Patient removed from your list",
                    "patientId", updated.getId()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error"));
        }
    }


    /**
     * List all patients assigned to the current logged-in doctor.
     * GET /api/doctor/patients
     */
    @GetMapping("/patients")
    public ResponseEntity<?> listMyPatients(Authentication authentication) {
        String doctorId = (String) authentication.getPrincipal();
        List<User> patients = doctorService.getPatientsForDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }

    /**
     * Optional: Admin can get patients under any doctor (admin role check is on SecurityConfig)
     */
    @GetMapping("/patients/{doctorId}")
    public ResponseEntity<?> listPatientsForDoctorId(@PathVariable String doctorId) {
        List<User> patients = doctorService.getPatientsForDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }
}
