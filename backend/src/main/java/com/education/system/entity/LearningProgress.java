package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

/**
 * 学习进度实体类
 */
@TableName("learning_progress")
public class LearningProgress {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("student_id")
    private Long studentId;
    
    @TableField("content_id")
    private Long contentId;
    
    @TableField("is_completed")
    private Boolean isCompleted;
    
    @TableField("completion_date")
    private LocalDateTime completionDate;
    
    @TableField("time_spent_minutes")
    private Integer timeSpentMinutes;
    
    @TableField("last_accessed")
    private LocalDateTime lastAccessed;
    
    // 构造函数
    public LearningProgress() {}
    
    public LearningProgress(Long studentId, Long contentId) {
        this.studentId = studentId;
        this.contentId = contentId;
        this.isCompleted = false;
        this.timeSpentMinutes = 0;
        this.lastAccessed = LocalDateTime.now();
    }
    
    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public Long getContentId() {
        return contentId;
    }
    
    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }
    
    public Boolean getIsCompleted() {
        return isCompleted;
    }
    
    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
        if (isCompleted && this.completionDate == null) {
            this.completionDate = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getCompletionDate() {
        return completionDate;
    }
    
    public void setCompletionDate(LocalDateTime completionDate) {
        this.completionDate = completionDate;
    }
    
    public Integer getTimeSpentMinutes() {
        return timeSpentMinutes;
    }
    
    public void setTimeSpentMinutes(Integer timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
    }
    
    public LocalDateTime getLastAccessed() {
        return lastAccessed;
    }
    
    public void setLastAccessed(LocalDateTime lastAccessed) {
        this.lastAccessed = lastAccessed;
    }
    
    @Override
    public String toString() {
        return "LearningProgress{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", contentId=" + contentId +
                ", isCompleted=" + isCompleted +
                ", timeSpentMinutes=" + timeSpentMinutes +
                '}';
    }
}