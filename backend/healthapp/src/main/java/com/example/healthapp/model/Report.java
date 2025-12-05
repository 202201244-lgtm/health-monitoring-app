package com.example.healthapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {

    @Id
    private String id;
    private String patientId;
    private String name;       // Name of the report
    private String fileUrl;    // Cloudinary URL
    private long uploadedAt;
    private String doctorComment;  // Only one comment

    // Getters and Setters
}