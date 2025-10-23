package com.education.system.controller;

import com.education.system.entity.*;
import com.education.system.service.CourseService;
import com.education.system.service.AssignmentService;
import com.education.system.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 教师端控制器
 */
@RestController
@RequestMapping("/teacher")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private AssignmentService assignmentService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 获取当前教师的课程列表
     */
    @GetMapping("/courses")
    public ResponseEntity<?> getMyCourses(HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long teacherId = jwtUtil.getUserIdFromToken(token);
            
            List<Course> courses = courseService.getCoursesByTeacher(teacherId);
            
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
     * 创建课程
     */
    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Course course, HttpServletRequest request) {
        try {
            String token = jwtUtil.getTokenFromRequest(request);
            Long teacherId = jwtUtil.getUserIdFromToken(token);
            
            course.setTeacherId(teacherId);
            Course createdCourse = courseService.createCourse(course);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdCourse);
            response.put("message", "课程创建成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "创建课程失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 更新课程
     */
    @PutMapping("/courses/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable Long courseId, @RequestBody Course course) {
        try {
            course.setId(courseId);
            Course updatedCourse = courseService.updateCourse(course);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updatedCourse);
            response.put("message", "课程更新成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "更新课程失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 删除课程
     */
    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "课程删除成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "删除课程失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 获取课程章节
     */
    @GetMapping("/courses/{courseId}/chapters")
    public ResponseEntity<?> getCourseChapters(@PathVariable Long courseId) {
        try {
            List<CourseChapter> chapters = courseService.getChaptersByCourse(courseId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", chapters);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取章节失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 创建章节
     */
    @PostMapping("/courses/{courseId}/chapters")
    public ResponseEntity<?> createChapter(@PathVariable Long courseId, @RequestBody CourseChapter chapter) {
        try {
            chapter.setCourseId(courseId);
            CourseChapter createdChapter = courseService.createChapter(chapter);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdChapter);
            response.put("message", "章节创建成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "创建章节失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 获取课程作业列表
     */
    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<?> getCourseAssignments(@PathVariable Long courseId) {
        try {
            List<Assignment> assignments = assignmentService.getAssignmentsByCourse(courseId);
            
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
     * 创建作业
     */
    @PostMapping("/courses/{courseId}/assignments")
    public ResponseEntity<?> createAssignment(@PathVariable Long courseId, @RequestBody Assignment assignment) {
        try {
            assignment.setCourseId(courseId);
            Assignment createdAssignment = assignmentService.createAssignment(assignment);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", createdAssignment);
            response.put("message", "作业创建成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "创建作业失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 发布作业
     */
    @PutMapping("/assignments/{assignmentId}/publish")
    public ResponseEntity<?> publishAssignment(@PathVariable Long assignmentId) {
        try {
            assignmentService.publishAssignment(assignmentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "作业发布成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "发布作业失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 获取作业提交列表
     */
    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<?> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        try {
            List<AssignmentSubmission> submissions = assignmentService.getSubmissionsByAssignment(assignmentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", submissions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "获取提交列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}