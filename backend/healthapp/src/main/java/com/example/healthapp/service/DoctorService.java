package com.example.healthapp.service;

import com.example.healthapp.model.Role;
import com.example.healthapp.model.User;
import com.example.healthapp.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final UserRepository userRepo;

    public DoctorService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * Assigns a patient to a doctor (by storing doctorId in patient's assignedDoctorId)
     */
    public User assignPatientToDoctor(String doctorId, String patientId) {
        Optional<User> optPatient = userRepo.findById(patientId);
        if (optPatient.isEmpty()) {
            throw new IllegalArgumentException("Patient not found");
        }

        User patient = optPatient.get();

        // Ensure the target is indeed a patient
        if (patient.getRole() == null || !patient.getRole().name().contains("PATIENT")) {
            throw new IllegalArgumentException("Target user is not a patient");
        }

        // Set/override assignment
        patient.setAssignedDoctorId(doctorId);
        return userRepo.save(patient);
    }

    public User removePatientFromDoctor(String doctorId, String patientId) {
        Optional<User> optPatient = userRepo.findById(patientId);
        if (optPatient.isEmpty()) {
            throw new IllegalArgumentException("Patient not found");
        }

        User patient = optPatient.get();

        // ensure this patient actually belongs to the current doctor
        if (patient.getAssignedDoctorId() == null || !patient.getAssignedDoctorId().equals(doctorId)) {
            throw new IllegalArgumentException("This patient is not assigned under you");
        }

        patient.setAssignedDoctorId(null);
        return userRepo.save(patient);
    }


    /**
     * Returns all patients assigned to given doctor id.
     */
    public List<User> getPatientsForDoctor(String doctorId) {
        return userRepo.findByAssignedDoctorId(doctorId);
    }
}
