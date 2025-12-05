package com.example.healthapp.repo;

import com.example.healthapp.model.TelemetryRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TelemetryRepository extends MongoRepository<TelemetryRecord, String> {

    // Order by startTimestamp instead of timestamp
    List<TelemetryRecord> findByPatientIdOrderByStartTimestampDesc(String patientId);

    List<TelemetryRecord> findByPatientIdAndTypeOrderByStartTimestampDesc(String patientId, String type);

    TelemetryRecord findFirstByPatientIdOrderByStartTimestampDesc(String patientId);
}
