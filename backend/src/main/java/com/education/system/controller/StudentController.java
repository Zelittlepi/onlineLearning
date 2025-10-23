package com.education.system.controller;

import com.education.system.entity.AssignmentSubmission;
import com.education.system.entity.Course;
import com.education.system.entity.CourseEnrollment;
import com.education.system.entity.LearningProgress;
import com.education.system.service.StudentService;
import com.education.system.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 学生端控制器
 */
@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 测试端点 - 不需要验证
     */
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "StudentController is working!");
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取学生的所有课程
     */
    @GetMapping("/courses")
    public ResponseEntity<?> getMyCourses(HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            List<Map<String, Object>> courses = studentService.getStudentCourses(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", courses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取课程列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 选课
     */
    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<?> enrollCourse(@PathVariable Long courseId, HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            CourseEnrollment enrollment = studentService.enrollCourse(studentId, courseId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", enrollment);
            response.put("message", "选课成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "选课失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 退课
     */
    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<?> dropCourse(@PathVariable Long courseId, HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            studentService.dropCourse(studentId, courseId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "退课成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "退课失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 获取学生的作业任务
     */
    @GetMapping("/assignments")
    public ResponseEntity<?> getMyAssignments(HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            List<Map<String, Object>> assignments = studentService.getStudentAssignments(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", assignments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取作业列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 提交作业
     */
    @PostMapping("/assignments/{assignmentId}/submit")
    public ResponseEntity<?> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestBody Map<String, String> submissionData,
            HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            String submissionText = submissionData.get("submissionText");
            String fileUrl = submissionData.get("fileUrl");
            String submissionUrl = submissionData.get("submissionUrl");
            
            AssignmentSubmission submission = studentService.submitAssignment(
                studentId, assignmentId, submissionText, fileUrl, submissionUrl
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", submission);
            response.put("message", "作业提交成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "作业提交失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 更新学习进度
     */
    @PostMapping("/progress")
    public ResponseEntity<?> updateProgress(
            @RequestBody Map<String, Object> progressData,
            HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            Long contentId = Long.valueOf(progressData.get("contentId").toString());
            Integer timeSpent = Integer.valueOf(progressData.get("timeSpent").toString());
            
            LearningProgress progress = studentService.updateLearningProgress(studentId, contentId, timeSpent);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", progress);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "更新学习进度失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 获取可选课程列表
     */
    @GetMapping("/available-courses")
    public ResponseEntity<?> getAvailableCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            List<Course> courses;
            if (keyword != null || category != null || level != null) {
                courses = studentService.searchAvailableCourses(studentId, keyword, category, level);
            } else {
                courses = studentService.getAvailableCourses(studentId);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", courses);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取可选课程失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 标记内容为已完成
     */
    @PostMapping("/content/{contentId}/complete")
    public ResponseEntity<?> markContentCompleted(@PathVariable Long contentId, HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long studentId = jwtUtil.getUserIdFromToken(token);
            
            studentService.markContentCompleted(studentId, contentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "内容标记为已完成");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "标记完成失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}