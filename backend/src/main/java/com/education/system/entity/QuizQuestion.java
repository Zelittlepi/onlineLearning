package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 测验题目实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("quiz_questions")
public class QuizQuestion {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 活动ID
     */
    @TableField("activity_id")
    private Long activityId;

    /**
     * 题目文本
     */
    @TableField("question_text")
    private String questionText;

    /**
     * 题目类型：MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, ESSAY, FILL_BLANK
     */
    @TableField("question_type")
    private String questionType;

    /**
     * 题目分值
     */
    @TableField("points")
    private BigDecimal points;

    /**
     * 题目顺序
     */
    @TableField("order_index")
    private Integer orderIndex;

    /**
     * 题目设置（JSON格式，存储正确答案、配置等）
     */
    @TableField("settings")
    private String settings;

    /**
     * 题目解析
     */
    @TableField("explanation")
    private String explanation;

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
     * 题目选项（关联查询时使用）
     */
    @TableField(exist = false)
    private List<QuizOption> options;

    /**
     * 学生答案（关联查询时使用）
     */
    @TableField(exist = false)
    private StudentAnswer studentAnswer;

    /**
     * 题目类型枚举
     */
    public enum QuestionType {
        MULTIPLE_CHOICE("MULTIPLE_CHOICE", "Multiple Choice"),
        TRUE_FALSE("TRUE_FALSE", "True/False"),
        SHORT_ANSWER("SHORT_ANSWER", "Short Answer"),
        ESSAY("ESSAY", "Essay"),
        FILL_BLANK("FILL_BLANK", "Fill in the Blank");

        private final String code;
        private final String name;

        QuestionType(String code, String name) {
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