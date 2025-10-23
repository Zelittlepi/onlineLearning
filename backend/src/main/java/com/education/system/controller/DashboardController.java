package com.education.system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    
    @GetMapping("/teacher/dashboard")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getTeacherDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("message", "Welcome to Teacher Dashboard");
        dashboard.put("modules", new String[]{
            "Teacher Home",
            "Course Management", 
            "Learning Activities",
            "Notifications",
            "Personal Center",
            "AI Agent"
        });
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/student/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStudentDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("message", "Welcome to Student Dashboard");
        dashboard.put("modules", new String[]{
            "Student Home",
            "Course",
            "Activities", 
            "Notifications",
            "AI Agent",
            "Personal Center"
        });
        return ResponseEntity.ok(dashboard);
    }
}