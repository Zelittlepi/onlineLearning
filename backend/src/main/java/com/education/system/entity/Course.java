package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 课程实体类
 */
@TableName("courses")
public class Course {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String title;
    
    private String description;
    
    @TableField("cover_image_url")
    private String coverImageUrl;
    
    @TableField("teacher_id")
    private Long teacherId;
    
    private String category;
    
    private CourseLevel level;
    
    private BigDecimal price;
    
    @TableField("duration_hours")
    private Integer durationHours;
    
    @TableField("max_students")
    private Integer maxStudents;
    
    private CourseStatus status;
    
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    // 课程级别枚举
    public enum CourseLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
    
    // 课程状态枚举
    public enum CourseStatus {
        DRAFT, PUBLISHED, ARCHIVED
    }
    
    // 构造函数
    public Course() {}
    
    public Course(String title, String description, Long teacherId, String category, CourseLevel level, BigDecimal price) {
        this.title = title;
        this.description = description;
        this.teacherId = teacherId;
        this.category = category;
        this.level = level;
        this.price = price;
        this.status = CourseStatus.DRAFT;
        this.maxStudents = 100;
        this.durationHours = 0;
    }
    
    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCoverImageUrl() {
        return coverImageUrl;
    }
    
    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }
    
    public Long getTeacherId() {
        return teacherId;
    }
    
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public CourseLevel getLevel() {
        return level;
    }
    
    public void setLevel(CourseLevel level) {
        this.level = level;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public Integer getDurationHours() {
        return durationHours;
    }
    
    public void setDurationHours(Integer durationHours) {
        this.durationHours = durationHours;
    }
    
    public Integer getMaxStudents() {
        return maxStudents;
    }
    
    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }
    
    public CourseStatus getStatus() {
        return status;
    }
    
    public void setStatus(CourseStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", teacherId=" + teacherId +
                ", category='" + category + '\'' +
                ", level=" + level +
                ", price=" + price +
                ", status=" + status +
                '}';
    }
}