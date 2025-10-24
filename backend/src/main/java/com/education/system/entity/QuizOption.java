package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 测验选项实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("quiz_options")
public class QuizOption {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 题目ID
     */
    @TableField("question_id")
    private Long questionId;

    /**
     * 选项文本
     */
    @TableField("option_text")
    private String optionText;

    /**
     * 是否为正确答案
     */
    @TableField("is_correct")
    private Boolean isCorrect;

    /**
     * 选项顺序
     */
    @TableField("order_index")
    private Integer orderIndex;

    /**
     * 选项解析
     */
    @TableField("explanation")
    private String explanation;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}