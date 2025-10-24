package com.education.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.education.system.entity.ActivitySubmission;
import com.education.system.entity.CourseActivity;
import com.education.system.mapper.ActivitySubmissionMapper;
import com.education.system.service.ActivitySubmissionService;
import com.education.system.service.CourseActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 活动提交服务实现类
 */
@Slf4j
@Service
public class ActivitySubmissionServiceImpl extends ServiceImpl<ActivitySubmissionMapper, ActivitySubmission> 
        implements ActivitySubmissionService {

    @Autowired
    private CourseActivityService courseActivityService;

    @Override
    @Transactional
    public ActivitySubmission submitActivity(ActivitySubmission submission) {
        // 验证提交次数
        CourseActivity activity = courseActivityService.getActivityById(submission.getActivityId());
        if (activity == null) {
            throw new RuntimeException("Activity not found");
        }
        
        if (activity.getAttemptsAllowed() > 0) {
            // 获取学生已提交的次数
            List<ActivitySubmission> existingSubmissions = getStudentSubmissions(
                submission.getStudentId(), submission.getActivityId());
            int attemptCount = existingSubmissions != null ? existingSubmissions.size() : 0;
            if (attemptCount >= activity.getAttemptsAllowed()) {
                throw new RuntimeException("Maximum attempts exceeded");
            }
        }
        
        // 检查截止时间并设置状态
        if (activity.getDueDate() != null && LocalDateTime.now().isAfter(activity.getDueDate())) {
            submission.setStatus("LATE_SUBMITTED");
        } else {
            submission.setStatus("SUBMITTED");
        }
        // 设置尝试次数
        List<ActivitySubmission> existingSubmissions = getStudentSubmissions(
            submission.getStudentId(), submission.getActivityId());
        int attemptNumber = existingSubmissions != null ? existingSubmissions.size() + 1 : 1;
        submission.setAttemptNumber(attemptNumber);
        
        save(submission);
        log.info("Student {} submitted activity {}", submission.getStudentId(), submission.getActivityId());
        return submission;
    }

    @Override
    @Transactional
    public ActivitySubmission gradeSubmission(Long id, BigDecimal score, String feedback, Long graderId) {
        ActivitySubmission submission = getById(id);
        if (submission != null) {
            submission.setScore(score);
            submission.setFeedback(feedback);
            submission.setStatus("GRADED");
            submission.setGradedAt(LocalDateTime.now());
            submission.setGradedBy(graderId);
            updateById(submission);
            log.info("Graded submission: {} with score: {} by grader: {}", id, score, graderId);
            return submission;
        }
        return null;
    }

    // 移除不需要的方法，使用继承的 getById 方法

    @Override
    public List<ActivitySubmission> getSubmissionsByActivity(Long activityId) {
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("activity_id", activityId)
               .orderByDesc("submitted_at");
        return list(wrapper);
    }

    // 移除了不在接口中定义的方法

    // 移除了不在接口中定义的方法 (getSubmissionStatistics, getStudentProgress, returnSubmission)

    @Override
    @Transactional
    public List<ActivitySubmission> batchGradeSubmissions(List<Map<String, Object>> gradingData, Long graderId) {
        List<ActivitySubmission> gradedSubmissions = new ArrayList<>();
        
        for (Map<String, Object> grading : gradingData) {
            Long submissionId = Long.parseLong(grading.get("submissionId").toString());
            BigDecimal score = new BigDecimal(grading.get("score").toString());
            String feedback = grading.get("feedback") != null ? grading.get("feedback").toString() : null;
            
            ActivitySubmission submission = getById(submissionId);
            if (submission != null) {
                submission.setScore(score);
                submission.setFeedback(feedback);
                submission.setStatus("GRADED");
                submission.setGradedAt(LocalDateTime.now());
                submission.setGradedBy(graderId);
                updateById(submission);
                gradedSubmissions.add(submission);
            }
        }
        
        log.info("Batch graded {} submissions by grader: {}", gradedSubmissions.size(), graderId);
        return gradedSubmissions;
    }

    @Override
    public List<ActivitySubmission> getTopPerformers(Long activityId, int limit) {
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("activity_id", activityId)
               .eq("status", "GRADED")
               .isNotNull("score")
               .orderByDesc("score")
               .last("LIMIT " + limit);
        return list(wrapper);
    }

    @Override
    public List<ActivitySubmission> getRecentSubmissions(Long teacherId, int hours) {
        // 简化实现：获取最近提交的记录
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "SUBMITTED")
               .orderByDesc("submitted_at")
               .last("LIMIT 20"); // 限制返回最近20条记录
        return list(wrapper);
    }

    // 移除了不在接口中定义的方法 getGradingWorkload

    @Override
    @Transactional
    public ActivitySubmission autoGradeSubmission(Long submissionId) {
        ActivitySubmission submission = getById(submissionId);
        if (submission == null) {
            return null;
        }
        
        CourseActivity activity = courseActivityService.getActivityById(submission.getActivityId());
        if (activity == null || !"QUIZ".equals(activity.getActivityType())) {
            return null;
        }
        
        // 自动评分逻辑（这里简化处理）
        BigDecimal score = calculateQuizScore(submission, activity);
        submission.setScore(score);
        submission.setStatus("GRADED");
        submission.setGradedAt(LocalDateTime.now());
        submission.setFeedback("Auto-graded");
        
        updateById(submission);
        log.info("Auto-graded quiz submission: {} with score: {}", submissionId, score);
        return submission;
    }

    @Override
    @Transactional
    public ActivitySubmission saveDraft(ActivitySubmission submission) {
        submission.setStatus("DRAFT");
        submission.setSubmittedAt(LocalDateTime.now());
        if (submission.getId() == null) {
            save(submission);
        } else {
            updateById(submission);
        }
        log.info("Saved draft submission for activity: {} by student: {}", 
                submission.getActivityId(), submission.getStudentId());
        return submission;
    }

    @Override
    public ActivitySubmission getStudentSubmission(Long studentId, Long activityId) {
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("student_id", studentId)
               .eq("activity_id", activityId)
               .orderByDesc("submitted_at")
               .last("LIMIT 1");
        return getOne(wrapper);
    }

    @Override
    public List<ActivitySubmission> getStudentSubmissions(Long studentId, Long activityId) {
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("student_id", studentId)
               .eq("activity_id", activityId)
               .orderByDesc("submitted_at");
        return list(wrapper);
    }

    @Override
    public IPage<ActivitySubmission> getPendingGrading(Long teacherId, Page<ActivitySubmission> page) {
        // 简化实现：返回所有SUBMITTED状态的提交
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "SUBMITTED")
               .orderByDesc("submitted_at");
        return page(page, wrapper);
    }

    @Override
    public Map<String, Object> getStudentStatistics(Long studentId, Long courseId) {
        Map<String, Object> statistics = new java.util.HashMap<>();
        
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("student_id", studentId);
        
        List<ActivitySubmission> submissions = list(wrapper);
        
        statistics.put("totalSubmissions", submissions.size());
        statistics.put("gradedSubmissions", submissions.stream().filter(s -> "GRADED".equals(s.getStatus())).count());
        statistics.put("averageScore", submissions.stream()
                .filter(s -> s.getScore() != null)
                .mapToDouble(s -> s.getScore().doubleValue())
                .average().orElse(0.0));
        
        return statistics;
    }

    @Override
    public List<ActivitySubmission> getLateSubmissions() {
        QueryWrapper<ActivitySubmission> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "LATE_SUBMITTED")
               .orderByDesc("submitted_at");
        return list(wrapper);
    }

    @Override
    public Boolean isSubmissionLate(Long activityId) {
        CourseActivity activity = courseActivityService.getById(activityId);
        if (activity != null && activity.getDueDate() != null) {
            return LocalDateTime.now().isAfter(activity.getDueDate());
        }
        return false;
    }

    @Override
    @Transactional
    public ActivitySubmission returnSubmissionToStudent(Long submissionId, String feedback) {
        ActivitySubmission submission = getById(submissionId);
        if (submission != null) {
            submission.setStatus("RETURNED");
            submission.setFeedback(feedback);
            submission.setGradedAt(LocalDateTime.now());
            updateById(submission);
            log.info("Returned submission {} to student with feedback", submissionId);
        }
        return submission;
    }

    @Override
    public ActivitySubmission getSubmissionWithDetails(Long submissionId) {
        ActivitySubmission submission = getById(submissionId);
        if (submission != null) {
            // 可以在这里加载额外的详细信息，比如答案解析等
            log.info("Retrieved submission with details: {}", submissionId);
        }
        return submission;
    }

    /**
     * 计算测验分数（简化实现）
     */
    private BigDecimal calculateQuizScore(ActivitySubmission submission, CourseActivity activity) {
        // 这里应该根据提交内容和正确答案计算分数
        // 暂时返回满分的80%作为示例
        return activity.getMaxScore().multiply(new BigDecimal("0.8"));
    }
}