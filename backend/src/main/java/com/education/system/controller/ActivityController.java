package com.education.system.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.system.entity.CourseActivity;
import com.education.system.service.CourseActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 课程活动控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ActivityController {

    @Autowired
    private CourseActivityService courseActivityService;

    /**
     * 创建新活动
     */
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createActivity(@RequestBody Map<String, Object> requestData) {
        try {
            log.info("Received activity data: {}", requestData);
            
            CourseActivity activity = new CourseActivity();
            
            // 安全地获取必需字段
            if (requestData.get("courseId") == null) {
                throw new IllegalArgumentException("courseId is required");
            }
            if (requestData.get("teacherId") == null) {
                throw new IllegalArgumentException("teacherId is required");
            }
            if (requestData.get("title") == null) {
                throw new IllegalArgumentException("title is required");
            }
            if (requestData.get("activityType") == null) {
                throw new IllegalArgumentException("activityType is required");
            }
            
            activity.setCourseId(Long.valueOf(requestData.get("courseId").toString()));
            activity.setTeacherId(Long.valueOf(requestData.get("teacherId").toString()));
            activity.setTitle((String) requestData.get("title"));
            
            // 安全地获取可选字段
            if (requestData.get("description") != null) {
                activity.setDescription((String) requestData.get("description"));
            }
            if (requestData.get("instructions") != null) {
                activity.setInstructions((String) requestData.get("instructions"));
            }
            
            activity.setActivityType((String) requestData.get("activityType"));
            
            // 处理日期时间
            if (requestData.get("dueDate") != null) {
                String dueDateStr = requestData.get("dueDate").toString();
                log.info("Processing dueDate: {}", dueDateStr);
                // 移除时区信息并解析
                if (dueDateStr.contains("T")) {
                    dueDateStr = dueDateStr.replace("Z", "").replace("T", " ");
                    if (dueDateStr.contains(".")) {
                        dueDateStr = dueDateStr.substring(0, dueDateStr.indexOf("."));
                    }
                    activity.setDueDate(LocalDateTime.parse(dueDateStr.replace(" ", "T")));
                }
            }
            
            if (requestData.get("maxScore") != null) {
                activity.setMaxScore(new BigDecimal(requestData.get("maxScore").toString()));
            }
            if (requestData.get("timeLimitMinutes") != null) {
                activity.setTimeLimitMinutes(Integer.valueOf(requestData.get("timeLimitMinutes").toString()));
            }
            if (requestData.get("attemptsAllowed") != null) {
                activity.setAttemptsAllowed(Integer.valueOf(requestData.get("attemptsAllowed").toString()));
            }
            
            if (requestData.get("submissionType") != null) {
                activity.setSubmissionType((String) requestData.get("submissionType"));
            }
            
            // 处理布尔值，提供默认值
            if (requestData.get("isPublished") != null) {
                activity.setIsPublished((Boolean) requestData.get("isPublished"));
            } else {
                activity.setIsPublished(false); // 默认值
            }
            
            if (requestData.get("isRequired") != null) {
                activity.setIsRequired((Boolean) requestData.get("isRequired"));
            } else {
                activity.setIsRequired(true); // 默认值
            }
            
            if (requestData.get("weight") != null) {
                activity.setWeight(new BigDecimal(requestData.get("weight").toString()));
            }
            
            if (requestData.get("gradingMethod") != null) {
                activity.setGradingMethod((String) requestData.get("gradingMethod"));
            }
            
            log.info("Creating activity: {}", activity);
            CourseActivity created = courseActivityService.createActivity(activity);
            log.info("Activity created successfully with ID: {}", created.getId());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error creating activity", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("type", e.getClass().getSimpleName());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * 更新活动
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<CourseActivity> updateActivity(@PathVariable Long id, 
                                                        @RequestBody CourseActivity activity) {
        try {
            activity.setId(id);
            CourseActivity updated = courseActivityService.updateActivity(activity);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating activity", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 获取活动详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseActivity> getActivity(@PathVariable Long id) {
        CourseActivity activity = courseActivityService.getActivityById(id);
        if (activity != null) {
            return ResponseEntity.ok(activity);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 获取课程的所有活动
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseActivity>> getActivitiesByCourse(@PathVariable Long courseId) {
        List<CourseActivity> activities = courseActivityService.getActivitiesByCourseId(courseId);
        return ResponseEntity.ok(activities);
    }

    /**
     * 获取教师的活动列表（分页）
     */
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<IPage<CourseActivity>> getTeacherActivities(
            @PathVariable Long teacherId,
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String activityType) {
        
        Page<CourseActivity> page = new Page<>(current, size);
        IPage<CourseActivity> activities = courseActivityService.getActivitiesByTeacher(
                teacherId, activityType, page);
        return ResponseEntity.ok(activities);
    }

    /**
     * 获取学生相关的活动
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseActivity>> getStudentActivities(
            @PathVariable Long studentId,
            @RequestParam(required = false) String activityType) {
        
        List<CourseActivity> activities = courseActivityService.getActivitiesForStudent(
                studentId, activityType);
        return ResponseEntity.ok(activities);
    }

    /**
     * 发布活动
     */
    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> publishActivity(@PathVariable Long id) {
        boolean success = courseActivityService.publishActivity(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 取消发布活动
     */
    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> unpublishActivity(@PathVariable Long id) {
        boolean success = courseActivityService.unpublishActivity(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 删除活动
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        boolean success = courseActivityService.deleteActivity(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 复制活动到其他课程
     */
    @PostMapping("/{id}/duplicate")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<CourseActivity> duplicateActivity(@PathVariable Long id, 
                                                           @RequestParam Long targetCourseId) {
        CourseActivity duplicated = courseActivityService.duplicateActivity(id, targetCourseId);
        if (duplicated != null) {
            return ResponseEntity.ok(duplicated);
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * 获取即将到期的活动
     */
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<CourseActivity>> getUpcomingActivities(
            @RequestParam(defaultValue = "24") int hours) {
        
        List<CourseActivity> activities = courseActivityService.getUpcomingActivities(hours);
        return ResponseEntity.ok(activities);
    }

    /**
     * 获取活动统计信息
     */
    @GetMapping("/statistics/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Map<String, Object>> getActivityStatistics(@PathVariable Long teacherId) {
        Map<String, Object> statistics = courseActivityService.getActivityStatistics(teacherId);
        return ResponseEntity.ok(statistics);
    }

    /**
     * 批量创建活动
     */
    @PostMapping("/batch")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<CourseActivity>> batchCreateActivities(
            @RequestBody List<CourseActivity> activities) {
        try {
            List<CourseActivity> created = courseActivityService.batchCreateActivities(activities);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error batch creating activities", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 获取活动模板
     */
    @GetMapping("/template/{activityType}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<CourseActivity> getActivityTemplate(@PathVariable String activityType) {
        CourseActivity template = courseActivityService.getActivityTemplate(activityType);
        return ResponseEntity.ok(template);
    }
}