package com.example.healthapp.controller;

import com.cloudinary.Cloudinary;
import com.example.healthapp.model.Report;
import com.example.healthapp.repo.ReportRepository;
import com.example.healthapp.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final FileUploadService fileUploadService;
    private final ReportRepository reportRepository;
    @Autowired
    private Cloudinary cloudinary;

    public ReportController(FileUploadService fileUploadService,
            ReportRepository reportRepository) {
        this.fileUploadService = fileUploadService;
        this.reportRepository = reportRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") String patientId,
            @RequestParam("name") String name,
            @RequestParam("doctorComment") String doctorComment) throws Exception {
        System.out.println("DEBUG: connection hit uploadReport. PatientId: " + patientId);
        String fileUrl = fileUploadService.uploadFile(file);

        Report report = new Report();
        report.setPatientId(patientId);
        report.setName(name);
        report.setDoctorComment(doctorComment);
        report.setFileUrl(fileUrl);
        report.setUploadedAt(System.currentTimeMillis());

        // 💾 Save into MongoDB
        Report savedReport = reportRepository.save(report);

        return ResponseEntity.ok(savedReport);
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<Report>> getReportsByPatient(@PathVariable String patientId) {
        List<Report> reports = reportRepository.findByPatientId(patientId);
        return ResponseEntity.ok(reports);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<?> getReportById(@PathVariable String id) {
    // return reportRepository.findById(id)
    // .map(ResponseEntity::ok)
    // .orElse(ResponseEntity.notFound().build());
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable String id) {
        if (reportRepository.existsById(id)) {
            reportRepository.deleteById(id);
            return ResponseEntity.ok("Report deleted successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Report not found");
        }
    }

}
