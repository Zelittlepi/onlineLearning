package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 作业提交实体类
 */
@TableName("assignment_submissions")
public class AssignmentSubmission {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("assignment_id")
    private Long assignmentId;
    
    @TableField("student_id")
    private Long studentId;
    
    @TableField("submission_text")
    private String submissionText;
    
    @TableField("file_url")
    private String fileUrl;
    
    @TableField("submission_url")
    private String submissionUrl;
    
    @TableField("submitted_at")
    private LocalDateTime submittedAt;
    
    private BigDecimal score;
    
    private String feedback;
    
    @TableField("graded_at")
    private LocalDateTime gradedAt;
    
    @TableField("graded_by")
    private Long gradedBy;
    
    private SubmissionStatus status;
    
    // 提交状态枚举
    public enum SubmissionStatus {
        SUBMITTED, GRADED, RETURNED
    }
    
    // 构造函数
    public AssignmentSubmission() {}
    
    public AssignmentSubmission(Long assignmentId, Long studentId) {
        this.assignmentId = assignmentId;
        this.studentId = studentId;
        this.submittedAt = LocalDateTime.now();
        this.status = SubmissionStatus.SUBMITTED;
    }
    
    // Getter 和 Setter 方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getAssignmentId() {
        return assignmentId;
    }
    
    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getSubmissionText() {
        return submissionText;
    }
    
    public void setSubmissionText(String submissionText) {
        this.submissionText = submissionText;
    }
    
    public String getFileUrl() {
        return fileUrl;
    }
    
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
    
    public String getSubmissionUrl() {
        return submissionUrl;
    }
    
    public void setSubmissionUrl(String submissionUrl) {
        this.submissionUrl = submissionUrl;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public BigDecimal getScore() {
        return score;
    }
    
    public void setScore(BigDecimal score) {
        this.score = score;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    
    public LocalDateTime getGradedAt() {
        return gradedAt;
    }
    
    public void setGradedAt(LocalDateTime gradedAt) {
        this.gradedAt = gradedAt;
    }
    
    public Long getGradedBy() {
        return gradedBy;
    }
    
    public void setGradedBy(Long gradedBy) {
        this.gradedBy = gradedBy;
    }
    
    public SubmissionStatus getStatus() {
        return status;
    }
    
    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }
    
    @Override
    public String toString() {
        return "AssignmentSubmission{" +
                "id=" + id +
                ", assignmentId=" + assignmentId +
                ", studentId=" + studentId +
                ", status=" + status +
                ", score=" + score +
                '}';
    }
}