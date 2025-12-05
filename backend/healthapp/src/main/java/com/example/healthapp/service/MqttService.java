package com.example.healthapp.service;

import com.example.healthapp.model.TelemetryRecord;
import com.example.healthapp.repo.TelemetryRepository;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MqttService {

    private final TelemetryRepository repo;
    private final MqttConnectOptions options;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MqttService(TelemetryRepository repo, MqttConnectOptions options) {
        this.repo = repo;
        this.options = options;
    }

    @PostConstruct
    public void init() {
        try {
            MqttClient client = new MqttClient("ssl://eeeaf4837dbe4d58909102526709abf6.s1.eu.hivemq.cloud:8883", MqttClient.generateClientId());
            client.connect(options);

            client.subscribe("patient/+/+"); // subscribe to all patient sensor topics

            client.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    System.out.println("⚠ MQTT connection lost: " + cause.getMessage());
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) {
                    try {
                        System.out.println("📥 MQTT: " + topic + " => " + new String(message.getPayload()));

                        // Parse topic: patient/{PATIENT_ID}/{type}
                        String[] parts = topic.split("/");
                        String patientId = parts[1];
                        String type = parts[2];

                        // Parse payload JSON
                        Map<String, Object> payload = objectMapper.readValue(
                                message.getPayload(), Map.class);

                        List<Double> values = ((List<?>) payload.get("data"))
                                .stream().map(v -> Double.parseDouble(v.toString()))
                                .toList();

                        // Use timestamp from payload as start of batch
                        long batchStart = Instant.parse(payload.get("timestamp").toString()).toEpochMilli();

                        // Calculate batch end timestamp assuming uniform 1-second interval between readings
                        long batchEnd = batchStart + (values.size() - 1) * 1000L; // 1 reading/sec

                        TelemetryRecord record = new TelemetryRecord();
                        record.setPatientId(patientId);
                        record.setType(type);
                        record.setValues(values);
                        record.setStartTimestamp(batchStart);
                        record.setEndTimestamp(batchEnd);

                        repo.save(record); // save entire batch as single document

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {}
            });

            System.out.println("✅ MQTT Service started & subscribed to topics.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
