package com.example.healthapp.repo;

import com.example.healthapp.model.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByPatientId(String patientId);
}
