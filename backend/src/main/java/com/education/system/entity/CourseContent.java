package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

/**
 * 课程内容实体类
 */
@TableName("course_contents")
public class CourseContent {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("chapter_id")
    private Long chapterId;
    
    private String title;
    
    @TableField("content_type")
    private ContentType contentType;
    
    @TableField("content_url")
    private String contentUrl;
    
    @TableField("content_text")
    private String contentText;
    
    @TableField("order_index")
    private Integer orderIndex;
    
    @TableField("duration_minutes")
    private Integer durationMinutes;
    
    @TableField("is_free")
    private Boolean isFree;
    
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    // 内容类型枚举
    public enum ContentType {
        VIDEO, DOCUMENT, QUIZ, ASSIGNMENT
    }
    
    // 构造函数
    public CourseContent() {}
    
    public CourseContent(Long chapterId, String title, ContentType contentType, Integer orderIndex) {
        this.chapterId = chapterId;
        this.title = title;
        this.contentType = contentType;
        this.orderIndex = orderIndex;
        this.durationMinutes = 0;
        this.isFree = false;
    }
    
    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getChapterId() {
        return chapterId;
    }
    
    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public ContentType getContentType() {
        return contentType;
    }
    
    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }
    
    public String getContentUrl() {
        return contentUrl;
    }
    
    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }
    
    public String getContentText() {
        return contentText;
    }
    
    public void setContentText(String contentText) {
        this.contentText = contentText;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public Boolean getIsFree() {
        return isFree;
    }
    
    public void setIsFree(Boolean isFree) {
        this.isFree = isFree;
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
        return "CourseContent{" +
                "id=" + id +
                ", chapterId=" + chapterId +
                ", title='" + title + '\'' +
                ", contentType=" + contentType +
                ", orderIndex=" + orderIndex +
                '}';
    }
}