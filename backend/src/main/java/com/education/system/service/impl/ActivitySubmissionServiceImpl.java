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
            int attemptCount = getAttemptCount(submission.getActivityId(), submission.getStudentId());
            if (attemptCount >= activity.getAttemptsAllowed()) {
                throw new RuntimeException("Maximum attempts exceeded");
            }
        }
        
        // 检查截止时间
        if (activity.getDueDate() != null && LocalDateTime.now().isAfter(activity.getDueDate())) {
            submission.setIsLate(true);
        } else {
            submission.setIsLate(false);
        }
        
        // 设置初始状态
        submission.setStatus("SUBMITTED");
        submission.setAttemptNumber(getAttemptCount(submission.getActivityId(), submission.getStudentId()) + 1);
        
        save(submission);
        log.info("Student {} submitted activity {}", submission.getStudentId(), submission.getActivityId());
        return submission;
    }

    @Override
    @Transactional
    public ActivitySubmission gradeSubmission(Long id, BigDecimal score, String feedback) {
        ActivitySubmission submission = getById(id);
        if (submission != null) {
            submission.setScore(score);
            submission.setFeedback(feedback);
            submission.setStatus("GRADED");
            submission.setGradedAt(LocalDateTime.now());
            updateById(submission);
            log.info("Graded submission: {} with score: {}", id, score);
            return submission;
        }
        return null;
    }

    @Override
    public ActivitySubmission getSubmissionById(Long id) {
        return getById(id);
    }

    @Override
    public List<ActivitySubmission> getSubmissionsByActivity(Long activityId) {
        return baseMapper.selectByActivityIdWithStudentInfo(activityId);
    }

    @Override
    public List<ActivitySubmission> getSubmissionsByStudent(Long studentId) {
        return baseMapper.selectByStudentIdWithActivityInfo(studentId);
    }

    @Override
    public ActivitySubmission getSubmissionByActivityAndStudent(Long activityId, Long studentId) {
        return baseMapper.selectByActivityAndStudent(activityId, studentId);
    }

    @Override
    public List<ActivitySubmission> getSubmissionsByTeacher(Long teacherId) {
        return baseMapper.selectByTeacherIdWithDetails(teacherId);
    }

    @Override
    public IPage<ActivitySubmission> getSubmissionsForGrading(Long teacherId, String status, Page<ActivitySubmission> page) {
        return baseMapper.selectForGrading(page, teacherId, status);
    }

    @Override
    public int getAttemptCount(Long activityId, Long studentId) {
        QueryWrapper<ActivitySubmission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("activity_id", activityId)
                   .eq("student_id", studentId);
        return (int) count(queryWrapper);
    }

    @Override
    public Map<String, Object> getSubmissionStatistics(Long activityId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 总提交数
        QueryWrapper<ActivitySubmission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("activity_id", activityId);
        long totalSubmissions = count(queryWrapper);
        statistics.put("totalSubmissions", totalSubmissions);
        
        // 已评分数
        queryWrapper.clear();
        queryWrapper.eq("activity_id", activityId).eq("status", "GRADED");
        long gradedSubmissions = count(queryWrapper);
        statistics.put("gradedSubmissions", gradedSubmissions);
        
        // 待评分数
        queryWrapper.clear();
        queryWrapper.eq("activity_id", activityId).eq("status", "SUBMITTED");
        long pendingSubmissions = count(queryWrapper);
        statistics.put("pendingSubmissions", pendingSubmissions);
        
        // 迟交数
        queryWrapper.clear();
        queryWrapper.eq("activity_id", activityId).eq("is_late", true);
        long lateSubmissions = count(queryWrapper);
        statistics.put("lateSubmissions", lateSubmissions);
        
        // 平均分
        Map<String, Object> scoreStats = baseMapper.getScoreStatistics(activityId);
        statistics.putAll(scoreStats);
        
        return statistics;
    }

    @Override
    public Map<String, Object> getStudentProgress(Long studentId, Long courseId) {
        Map<String, Object> progress = new HashMap<>();
        
        // 总活动数
        CourseActivity activity = new CourseActivity();
        activity.setCourseId(courseId);
        QueryWrapper<CourseActivity> activityQuery = new QueryWrapper<>(activity);
        activityQuery.eq("is_published", true);
        long totalActivities = courseActivityService.count(activityQuery);
        progress.put("totalActivities", totalActivities);
        
        // 已提交数
        QueryWrapper<ActivitySubmission> submissionQuery = new QueryWrapper<>();
        submissionQuery.eq("student_id", studentId)
                      .inSql("activity_id", "SELECT id FROM course_activities WHERE course_id = " + courseId);
        long submittedActivities = count(submissionQuery);
        progress.put("submittedActivities", submittedActivities);
        
        // 已评分数
        submissionQuery.clear();
        submissionQuery.eq("student_id", studentId)
                      .eq("status", "GRADED")
                      .inSql("activity_id", "SELECT id FROM course_activities WHERE course_id = " + courseId);
        long gradedActivities = count(submissionQuery);
        progress.put("gradedActivities", gradedActivities);
        
        // 平均分
        Map<String, Object> scoreStats = baseMapper.getStudentScoreStatistics(studentId, courseId);
        progress.putAll(scoreStats);
        
        return progress;
    }

    @Override
    @Transactional
    public Boolean returnSubmission(Long id, String reason) {
        ActivitySubmission submission = getById(id);
        if (submission != null) {
            submission.setStatus("RETURNED");
            submission.setFeedback(reason);
            submission.setGradedAt(LocalDateTime.now());
            updateById(submission);
            log.info("Returned submission: {} with reason: {}", id, reason);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public Boolean batchGradeSubmissions(List<Long> submissionIds, BigDecimal score, String feedback) {
        List<ActivitySubmission> submissions = listByIds(submissionIds);
        for (ActivitySubmission submission : submissions) {
            submission.setScore(score);
            submission.setFeedback(feedback);
            submission.setStatus("GRADED");
            submission.setGradedAt(LocalDateTime.now());
        }
        updateBatchById(submissions);
        log.info("Batch graded {} submissions", submissionIds.size());
        return true;
    }

    @Override
    public List<ActivitySubmission> getTopPerformers(Long activityId, int limit) {
        return baseMapper.selectTopPerformers(activityId, limit);
    }

    @Override
    public List<ActivitySubmission> getRecentSubmissions(Long teacherId, int hours) {
        return baseMapper.selectRecentSubmissions(teacherId, hours);
    }

    @Override
    public Map<String, Object> getGradingWorkload(Long teacherId) {
        Map<String, Object> workload = new HashMap<>();
        
        // 待评分的总数
        QueryWrapper<ActivitySubmission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "SUBMITTED")
                   .inSql("activity_id", 
                          "SELECT id FROM course_activities WHERE teacher_id = " + teacherId);
        long pendingCount = count(queryWrapper);
        workload.put("pendingGrading", pendingCount);
        
        // 按活动类型分组的待评分数
        List<Object> typeStats = baseMapper.countPendingByType(teacherId);
        workload.put("pendingByType", typeStats);
        
        // 紧急需要评分的（快到截止时间）
        List<Object> urgentStats = baseMapper.countUrgentGrading(teacherId, 24); // 24小时内截止
        workload.put("urgentGrading", urgentStats);
        
        return workload;
    }

    @Override
    @Transactional
    public ActivitySubmission autoGradeQuiz(Long submissionId) {
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

    /**
     * 计算测验分数（简化实现）
     */
    private BigDecimal calculateQuizScore(ActivitySubmission submission, CourseActivity activity) {
        // 这里应该根据提交内容和正确答案计算分数
        // 暂时返回满分的80%作为示例
        return activity.getMaxScore().multiply(new BigDecimal("0.8"));
    }
}