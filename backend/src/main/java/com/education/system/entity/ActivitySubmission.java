package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 活动提交实体类 (替代原 AssignmentSubmission)
 * 支持多种活动类型的提交
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("activity_submissions")
public class ActivitySubmission {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 活动ID
     */
    @TableField("activity_id")
    private Long activityId;

    /**
     * 学生ID
     */
    @TableField("student_id")
    private Long studentId;

    /**
     * 尝试次数
     */
    @TableField("attempt_number")
    private Integer attemptNumber;

    /**
     * 提交数据（JSON格式，存储复杂提交内容）
     */
    @TableField("submission_data")
    private String submissionData;

    /**
     * 提交文本内容
     */
    @TableField("submission_text")
    private String submissionText;

    /**
     * 文件URLs（JSON数组格式）
     */
    @TableField("file_urls")
    private String fileUrls;

    /**
     * 提交时间
     */
    @TableField("submitted_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime submittedAt;

    /**
     * 总分数
     */
    @TableField("score")
    private BigDecimal score;

    /**
     * 自动评分结果
     */
    @TableField("auto_score")
    private BigDecimal autoScore;

    /**
     * 手动评分结果
     */
    @TableField("manual_score")
    private BigDecimal manualScore;

    /**
     * 教师反馈
     */
    @TableField("feedback")
    private String feedback;

    /**
     * 自动反馈（JSON格式）
     */
    @TableField("auto_feedback")
    private String autoFeedback;

    /**
     * 评分时间
     */
    @TableField("graded_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime gradedAt;

    /**
     * 评分教师ID
     */
    @TableField("graded_by")
    private Long gradedBy;

    /**
     * 花费时间（分钟）
     */
    @TableField("time_spent_minutes")
    private Integer timeSpentMinutes;

    /**
     * 提交状态：DRAFT, SUBMITTED, GRADED, RETURNED, LATE_SUBMITTED
     */
    @TableField("status")
    private String status;

    /**
     * 是否为最终提交
     */
    @TableField("is_final")
    private Boolean isFinal;

    // 非数据库字段
    /**
     * 活动信息（关联查询时使用）
     */
    @TableField(exist = false)
    private CourseActivity activity;

    /**
     * 学生信息（关联查询时使用）
     */
    @TableField(exist = false)
    private User student;

    /**
     * 评分教师信息（关联查询时使用）
     */
    @TableField(exist = false)
    private User grader;

    /**
     * 提交状态枚举
     */
    public enum SubmissionStatus {
        DRAFT("DRAFT", "Draft"),
        SUBMITTED("SUBMITTED", "Submitted"),
        GRADED("GRADED", "Graded"),
        RETURNED("RETURNED", "Returned"),
        LATE_SUBMITTED("LATE_SUBMITTED", "Late Submitted");

        private final String code;
        private final String name;

        SubmissionStatus(String code, String name) {
            this.code = code;
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }
    }
}