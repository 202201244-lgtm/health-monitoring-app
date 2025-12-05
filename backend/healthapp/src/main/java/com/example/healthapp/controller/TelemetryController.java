package com.example.healthapp.controller;

import com.example.healthapp.model.TelemetryRecord;
import com.example.healthapp.repo.TelemetryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    private final TelemetryRepository repo;

    public TelemetryController(TelemetryRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{patientId}")
    public List<TelemetryRecord> getAllData(@PathVariable String patientId) {
        return repo.findByPatientIdOrderByStartTimestampDesc(patientId);
    }

    @GetMapping("/{patientId}/{type}")
    public List<TelemetryRecord> getDataByType(@PathVariable String patientId,
                                               @PathVariable String type) {
        return repo.findByPatientIdAndTypeOrderByStartTimestampDesc(patientId, type);
    }

    @GetMapping("/latest/{patientId}")
    public TelemetryRecord getLatest(@PathVariable String patientId) {
        return repo.findFirstByPatientIdOrderByStartTimestampDesc(patientId);
    }
}
