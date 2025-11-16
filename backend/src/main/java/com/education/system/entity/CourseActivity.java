package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 课程活动实体类 (替代原 Assignment)
 * 支持多种活动类型：ASSIGNMENT, QUIZ, ANNOUNCEMENT, PRACTICE, DISCUSSION, SURVEY
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("course_activities")
public class CourseActivity {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 课程ID
     */
    @TableField("course_id")
    private Long courseId;

    /**
     * 教师ID
     */
    @TableField("teacher_id")
    private Long teacherId;

    /**
     * 活动标题
     */
    @TableField("title")
    private String title;

    /**
     * 活动描述
     */
    @TableField("description")
    private String description;

    /**
     * 活动说明/指导
     */
    @TableField("instructions")
    private String instructions;

    /**
     * 活动类型：ASSIGNMENT, QUIZ, ANNOUNCEMENT, PRACTICE, DISCUSSION, SURVEY
     */
    @TableField("activity_type")
    private String activityType;

    /**
     * 截止时间
     */
    @TableField("due_date")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime dueDate;

    /**
     * 开始时间
     */
    @TableField("available_from")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime availableFrom;

    /**
     * 结束时间
     */
    @TableField("available_until")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime availableUntil;

    /**
     * 最高分数
     */
    @TableField("max_score")
    private BigDecimal maxScore;

    /**
     * 时间限制（分钟）
     */
    @TableField("time_limit_minutes")
    private Integer timeLimitMinutes;

    /**
     * 允许尝试次数
     */
    @TableField("attempts_allowed")
    private Integer attemptsAllowed;

    /**
     * 提交类型：FILE, TEXT, URL, MULTIPLE_CHOICE, MIXED
     */
    @TableField("submission_type")
    private String submissionType;

    /**
     * 是否已发布
     */
    @TableField("is_published")
    private Boolean isPublished;

    /**
     * 是否必需
     */
    @TableField("is_required")
    private Boolean isRequired;

    /**
     * 活动权重
     */
    @TableField("weight")
    private BigDecimal weight;

    /**
     * 评分方式：MANUAL, AUTO, PEER
     */
    @TableField("grading_method")
    private String gradingMethod;

    /**
     * 设置信息（JSON格式）
     */
    @TableField("settings")
    private String settings;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 非数据库字段
    /**
     * 课程名称（关联查询时使用）
     */
    @TableField(exist = false)
    private String courseName;

    /**
     * 教师名称（关联查询时使用）
     */
    @TableField(exist = false)
    private String teacherName;

    /**
     * 学生提交情况（关联查询时使用）
     */
    @TableField(exist = false)
    private ActivitySubmission submission;

    /**
     * 活动类型枚举
     */
    public enum ActivityType {
        ASSIGNMENT("ASSIGNMENT", "Assignment"),
        QUIZ("QUIZ", "Quiz"),
        ANNOUNCEMENT("ANNOUNCEMENT", "Announcement"),
        PRACTICE("PRACTICE", "Practice"),
        DISCUSSION("DISCUSSION", "Discussion"),
        SURVEY("SURVEY", "Survey");

        private final String code;
        private final String name;

        ActivityType(String code, String name) {
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

    /**
     * 提交类型枚举
     */
    public enum SubmissionType {
        FILE("FILE", "File Upload"),
        TEXT("TEXT", "Text Entry"),
        URL("URL", "URL Link"),
        MULTIPLE_CHOICE("MULTIPLE_CHOICE", "Multiple Choice"),
        MIXED("MIXED", "Mixed Format");

        private final String code;
        private final String name;

        SubmissionType(String code, String name) {
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

    /**
     * 评分方式枚举
     */
    public enum GradingMethod {
        MANUAL("MANUAL", "Manual Grading"),
        AUTO("AUTO", "Automatic Grading"),
        PEER("PEER", "Peer Review");

        private final String code;
        private final String name;

        GradingMethod(String code, String name) {
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