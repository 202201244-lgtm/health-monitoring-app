package com.example.healthapp.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "telemetry")
public class TelemetryRecord {
    @Id
    private String id;

    private String patientId;
    private long startTimestamp;
    private long endTimestamp;
    private List<Double> values;
    private String type; // hr, ecg, spo2, temp
}

