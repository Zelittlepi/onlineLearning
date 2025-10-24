package com.education.system.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.system.entity.ActivitySubmission;
import com.education.system.service.ActivitySubmissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 活动提交控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {

    @Autowired
    private ActivitySubmissionService submissionService;

    /**
     * 提交活动
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ActivitySubmission> submitActivity(@RequestBody ActivitySubmission submission) {
        try {
            ActivitySubmission created = submissionService.submitActivity(submission);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error submitting activity", e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * 评分提交
     */
    @PutMapping("/{id}/grade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ActivitySubmission> gradeSubmission(
            @PathVariable Long id,
            @RequestParam BigDecimal score,
            @RequestParam(required = false) String feedback) {
        
        try {
            ActivitySubmission graded = submissionService.gradeSubmission(id, score, feedback);
            if (graded != null) {
                return ResponseEntity.ok(graded);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error grading submission", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 获取提交详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<ActivitySubmission> getSubmission(@PathVariable Long id) {
        ActivitySubmission submission = submissionService.getSubmissionById(id);
        if (submission != null) {
            return ResponseEntity.ok(submission);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 获取活动的所有提交
     */
    @GetMapping("/activity/{activityId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<ActivitySubmission>> getSubmissionsByActivity(@PathVariable Long activityId) {
        List<ActivitySubmission> submissions = submissionService.getSubmissionsByActivity(activityId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * 获取学生的所有提交
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    public ResponseEntity<List<ActivitySubmission>> getSubmissionsByStudent(@PathVariable Long studentId) {
        List<ActivitySubmission> submissions = submissionService.getSubmissionsByStudent(studentId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * 获取特定学生在特定活动的提交
     */
    @GetMapping("/activity/{activityId}/student/{studentId}")
    public ResponseEntity<ActivitySubmission> getSubmissionByActivityAndStudent(
            @PathVariable Long activityId,
            @PathVariable Long studentId) {
        
        ActivitySubmission submission = submissionService.getSubmissionByActivityAndStudent(
                activityId, studentId);
        if (submission != null) {
            return ResponseEntity.ok(submission);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 获取教师相关的所有提交
     */
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<ActivitySubmission>> getSubmissionsByTeacher(@PathVariable Long teacherId) {
        List<ActivitySubmission> submissions = submissionService.getSubmissionsByTeacher(teacherId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * 获取需要评分的提交（分页）
     */
    @GetMapping("/grading/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<IPage<ActivitySubmission>> getSubmissionsForGrading(
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "SUBMITTED") String status) {
        
        Page<ActivitySubmission> page = new Page<>(current, size);
        IPage<ActivitySubmission> submissions = submissionService.getSubmissionsForGrading(
                teacherId, status, page);
        return ResponseEntity.ok(submissions);
    }

    /**
     * 获取学生提交次数
     */
    @GetMapping("/attempts/activity/{activityId}/student/{studentId}")
    public ResponseEntity<Integer> getAttemptCount(
            @PathVariable Long activityId,
            @PathVariable Long studentId) {
        
        int count = submissionService.getAttemptCount(activityId, studentId);
        return ResponseEntity.ok(count);
    }

    /**
     * 获取活动提交统计
     */
    @GetMapping("/statistics/activity/{activityId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getSubmissionStatistics(@PathVariable Long activityId) {
        Map<String, Object> statistics = submissionService.getSubmissionStatistics(activityId);
        return ResponseEntity.ok(statistics);
    }

    /**
     * 获取学生学习进度
     */
    @GetMapping("/progress/student/{studentId}/course/{courseId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getStudentProgress(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        
        Map<String, Object> progress = submissionService.getStudentProgress(studentId, courseId);
        return ResponseEntity.ok(progress);
    }

    /**
     * 退回提交
     */
    @PutMapping("/{id}/return")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> returnSubmission(
            @PathVariable Long id,
            @RequestParam String reason) {
        
        boolean success = submissionService.returnSubmission(id, reason);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 批量评分
     */
    @PutMapping("/batch-grade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> batchGradeSubmissions(
            @RequestParam List<Long> submissionIds,
            @RequestParam BigDecimal score,
            @RequestParam(required = false) String feedback) {
        
        try {
            boolean success = submissionService.batchGradeSubmissions(submissionIds, score, feedback);
            if (success) {
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error batch grading submissions", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 获取活动最佳表现者
     */
    @GetMapping("/top-performers/activity/{activityId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<ActivitySubmission>> getTopPerformers(
            @PathVariable Long activityId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<ActivitySubmission> topPerformers = submissionService.getTopPerformers(activityId, limit);
        return ResponseEntity.ok(topPerformers);
    }

    /**
     * 获取最近提交
     */
    @GetMapping("/recent/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<ActivitySubmission>> getRecentSubmissions(
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "24") int hours) {
        
        List<ActivitySubmission> recentSubmissions = submissionService.getRecentSubmissions(
                teacherId, hours);
        return ResponseEntity.ok(recentSubmissions);
    }

    /**
     * 获取教师评分工作量
     */
    @GetMapping("/workload/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getGradingWorkload(@PathVariable Long teacherId) {
        Map<String, Object> workload = submissionService.getGradingWorkload(teacherId);
        return ResponseEntity.ok(workload);
    }

    /**
     * 自动评分测验
     */
    @PutMapping("/{id}/auto-grade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ActivitySubmission> autoGradeQuiz(@PathVariable Long id) {
        try {
            ActivitySubmission graded = submissionService.autoGradeQuiz(id);
            if (graded != null) {
                return ResponseEntity.ok(graded);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error auto-grading quiz", e);
            return ResponseEntity.badRequest().build();
        }
    }
}