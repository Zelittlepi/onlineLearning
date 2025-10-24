package com.education.system.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.education.system.entity.ActivitySubmission;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 活动提交服务接口
 */
public interface ActivitySubmissionService extends IService<ActivitySubmission> {

    /**
     * 提交活动作业
     */
    ActivitySubmission submitActivity(ActivitySubmission submission);

    /**
     * 保存草稿
     */
    ActivitySubmission saveDraft(ActivitySubmission submission);

    /**
     * 获取学生的提交记录
     */
    ActivitySubmission getStudentSubmission(Long studentId, Long activityId);

    /**
     * 获取学生的所有提交记录（包括草稿和多次尝试）
     */
    List<ActivitySubmission> getStudentSubmissions(Long studentId, Long activityId);

    /**
     * 根据活动ID获取所有提交
     */
    List<ActivitySubmission> getSubmissionsByActivity(Long activityId);

    /**
     * 评分
     */
    ActivitySubmission gradeSubmission(Long submissionId, BigDecimal score, String feedback, Long graderId);

    /**
     * 自动评分（用于测验等）
     */
    ActivitySubmission autoGradeSubmission(Long submissionId);

    /**
     * 获取待评分的提交（教师视图）
     */
    IPage<ActivitySubmission> getPendingGrading(Long teacherId, Page<ActivitySubmission> page);

    /**
     * 批量评分
     */
    List<ActivitySubmission> batchGradeSubmissions(List<Map<String, Object>> gradingData, Long graderId);

    /**
     * 获取学生统计信息
     */
    Map<String, Object> getStudentStatistics(Long studentId, Long courseId);

    /**
     * 获取逾期提交列表
     */
    List<ActivitySubmission> getLateSubmissions();

    /**
     * 检查提交是否逾期
     */
    Boolean isSubmissionLate(Long activityId);

    /**
     * 返回提交给学生（需要修改）
     */
    ActivitySubmission returnSubmissionToStudent(Long submissionId, String feedback);

    /**
     * 获取提交详情（包含答案解析）
     */
    ActivitySubmission getSubmissionWithDetails(Long submissionId);

    /**
     * 获取活动最佳表现者
     */
    List<ActivitySubmission> getTopPerformers(Long activityId, int limit);

    /**
     * 获取最近提交记录
     */
    List<ActivitySubmission> getRecentSubmissions(Long teacherId, int hours);
}