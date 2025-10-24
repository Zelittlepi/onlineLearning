package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 学生答案实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("student_answers")
public class StudentAnswer {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 提交ID
     */
    @TableField("submission_id")
    private Long submissionId;

    /**
     * 题目ID
     */
    @TableField("question_id")
    private Long questionId;

    /**
     * 答案数据（JSON格式）
     */
    @TableField("answer_data")
    private String answerData;

    /**
     * 是否正确
     */
    @TableField("is_correct")
    private Boolean isCorrect;

    /**
     * 获得分数
     */
    @TableField("points_earned")
    private BigDecimal pointsEarned;

    /**
     * 花费时间（秒）
     */
    @TableField("time_spent_seconds")
    private Integer timeSpentSeconds;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // 非数据库字段
    /**
     * 题目信息（关联查询时使用）
     */
    @TableField(exist = false)
    private QuizQuestion question;
}