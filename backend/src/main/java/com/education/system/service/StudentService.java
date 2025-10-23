package com.education.system.service;

import com.education.system.entity.*;
import com.education.system.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 学生服务类
 */
@Service
public class StudentService {
    
    @Autowired
    private CourseEnrollmentMapper enrollmentMapper;
    
    @Autowired
    private LearningProgressMapper progressMapper;
    
    @Autowired
    private CourseMapper courseMapper;
    
    @Autowired
    private AssignmentMapper assignmentMapper;
    
    @Autowired
    private AssignmentSubmissionMapper submissionMapper;
    
    /**
     * 获取学生的所有课程
     */
    public List<Map<String, Object>> getStudentCourses(Long studentId) {
        List<CourseEnrollment> enrollments = enrollmentMapper.findByStudentId(studentId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (CourseEnrollment enrollment : enrollments) {
            Course course = courseMapper.selectById(enrollment.getCourseId());
            if (course != null) {
                Map<String, Object> courseInfo = new HashMap<>();
                courseInfo.put("enrollment", enrollment);
                courseInfo.put("course", course);
                
                // 计算学习进度
                BigDecimal progress = calculateCourseProgress(studentId, enrollment.getCourseId());
                courseInfo.put("actualProgress", progress);
                
                result.add(courseInfo);
            }
        }
        
        return result;
    }
    
    /**
     * 选课
     */
    @Transactional
    public CourseEnrollment enrollCourse(Long studentId, Long courseId) {
        // 检查是否已经选过课
        CourseEnrollment existing = enrollmentMapper.findByStudentIdAndCourseId(studentId, courseId);
        if (existing != null) {
            throw new RuntimeException("您已经选过这门课程了");
        }
        
        CourseEnrollment enrollment = new CourseEnrollment(studentId, courseId);
        enrollmentMapper.insert(enrollment);
        return enrollment;
    }
    
    /**
     * 退课
     */
    @Transactional
    public void dropCourse(Long studentId, Long courseId) {
        CourseEnrollment enrollment = enrollmentMapper.findByStudentIdAndCourseId(studentId, courseId);
        if (enrollment != null) {
            enrollment.setStatus(CourseEnrollment.EnrollmentStatus.DROPPED);
            enrollmentMapper.updateById(enrollment);
        }
    }
    
    /**
     * 获取学生的作业任务
     */
    public List<Map<String, Object>> getStudentAssignments(Long studentId) {
        // 获取学生选课的所有课程
        List<CourseEnrollment> enrollments = enrollmentMapper.findByStudentIdAndStatus(
            studentId, CourseEnrollment.EnrollmentStatus.ACTIVE.name()
        );
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (CourseEnrollment enrollment : enrollments) {
            // 获取课程的所有已发布作业
            List<Assignment> assignments = assignmentMapper.findByCourseIdAndPublished(
                enrollment.getCourseId(), true
            );
            
            for (Assignment assignment : assignments) {
                Map<String, Object> assignmentInfo = new HashMap<>();
                assignmentInfo.put("assignment", assignment);
                
                // 获取课程信息
                Course course = courseMapper.selectById(assignment.getCourseId());
                assignmentInfo.put("course", course);
                
                // 获取学生的提交情况
                AssignmentSubmission submission = submissionMapper.findByAssignmentIdAndStudentId(
                    assignment.getId(), studentId
                );
                assignmentInfo.put("submission", submission);
                
                // 判断是否逾期
                boolean isOverdue = assignment.getDueDate() != null && 
                    LocalDateTime.now().isAfter(assignment.getDueDate()) && 
                    submission == null;
                assignmentInfo.put("isOverdue", isOverdue);
                
                result.add(assignmentInfo);
            }
        }
        
        return result;
    }
    
    /**
     * 提交作业
     */
    @Transactional
    public AssignmentSubmission submitAssignment(Long studentId, Long assignmentId, 
                                                String submissionText, String fileUrl, String submissionUrl) {
        // 检查是否已经提交过
        AssignmentSubmission existing = submissionMapper.findByAssignmentIdAndStudentId(assignmentId, studentId);
        if (existing != null) {
            throw new RuntimeException("您已经提交过这个作业了");
        }
        
        AssignmentSubmission submission = new AssignmentSubmission(assignmentId, studentId);
        submission.setSubmissionText(submissionText);
        submission.setFileUrl(fileUrl);
        submission.setSubmissionUrl(submissionUrl);
        
        submissionMapper.insert(submission);
        return submission;
    }
    
    /**
     * 更新学习进度
     */
    @Transactional
    public LearningProgress updateLearningProgress(Long studentId, Long contentId, Integer timeSpent) {
        LearningProgress progress = progressMapper.findByStudentIdAndContentId(studentId, contentId);
        
        if (progress == null) {
            progress = new LearningProgress(studentId, contentId);
            progress.setTimeSpentMinutes(timeSpent);
            progressMapper.insert(progress);
        } else {
            progress.setTimeSpentMinutes(progress.getTimeSpentMinutes() + timeSpent);
            progress.setLastAccessed(LocalDateTime.now());
            progressMapper.updateById(progress);
        }
        
        return progress;
    }
    
    /**
     * 标记内容为已完成
     */
    @Transactional
    public void markContentCompleted(Long studentId, Long contentId) {
        LearningProgress progress = progressMapper.findByStudentIdAndContentId(studentId, contentId);
        
        if (progress == null) {
            progress = new LearningProgress(studentId, contentId);
            progress.setIsCompleted(true);
            progressMapper.insert(progress);
        } else {
            progress.setIsCompleted(true);
            progress.setCompletionDate(LocalDateTime.now());
            progressMapper.updateById(progress);
        }
        
        // 更新课程完成度
        updateCourseProgress(studentId, contentId);
    }
    
    /**
     * 计算课程学习进度
     */
    private BigDecimal calculateCourseProgress(Long studentId, Long courseId) {
        // 这里需要复杂的查询，暂时返回默认值
        // 实际实现需要统计课程下所有内容的完成情况
        return new BigDecimal("0.00");
    }
    
    /**
     * 获取可选课程列表（排除已选课程）
     */
    public List<Course> getAvailableCourses(Long studentId) {
        // 获取所有课程
        List<Course> allCourses = courseMapper.selectList(null);
        
        // 获取学生已选课程ID列表
        List<CourseEnrollment> enrollments = enrollmentMapper.findByStudentId(studentId);
        List<Long> enrolledCourseIds = new ArrayList<>();
        for (CourseEnrollment enrollment : enrollments) {
            // 只排除进行中和已完成的课程，已退课的可以重新选择
            if ("ACTIVE".equals(enrollment.getStatus()) || "COMPLETED".equals(enrollment.getStatus())) {
                enrolledCourseIds.add(enrollment.getCourseId());
            }
        }
        
        // 过滤掉已选课程
        List<Course> availableCourses = new ArrayList<>();
        for (Course course : allCourses) {
            if (!enrolledCourseIds.contains(course.getId())) {
                availableCourses.add(course);
            }
        }
        
        return availableCourses;
    }
    
    /**
     * 根据条件搜索可选课程
     */
    public List<Course> searchAvailableCourses(Long studentId, String keyword, String category, String level) {
        List<Course> availableCourses = getAvailableCourses(studentId);
        List<Course> filteredCourses = new ArrayList<>();
        
        for (Course course : availableCourses) {
            boolean matches = true;
            
            // 关键词搜索（标题或描述包含关键词）
            if (keyword != null && !keyword.trim().isEmpty()) {
                String lowerKeyword = keyword.toLowerCase();
                boolean titleMatch = course.getTitle() != null && 
                    course.getTitle().toLowerCase().contains(lowerKeyword);
                boolean descMatch = course.getDescription() != null && 
                    course.getDescription().toLowerCase().contains(lowerKeyword);
                if (!titleMatch && !descMatch) {
                    matches = false;
                }
            }
            
            // 分类筛选
            if (category != null && !category.trim().isEmpty() && 
                !category.equals("ALL")) {
                if (!category.equals(course.getCategory())) {
                    matches = false;
                }
            }
            
            // 难度筛选
            if (level != null && !level.trim().isEmpty() && 
                !level.equals("ALL")) {
                if (!level.equals(course.getLevel())) {
                    matches = false;
                }
            }
            
            if (matches) {
                filteredCourses.add(course);
            }
        }
        
        return filteredCourses;
    }
    
    /**
     * 更新课程完成度
     */
    private void updateCourseProgress(Long studentId, Long contentId) {
        // 根据内容ID找到课程ID，然后计算整体完成度
        // 实际实现需要更复杂的逻辑
    }
}