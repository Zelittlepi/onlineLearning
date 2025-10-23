package com.education.system.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 学生选课实体类
 */
@TableName("course_enrollments")
public class CourseEnrollment {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("student_id")
    private Long studentId;
    
    @TableField("course_id")
    private Long courseId;
    
    @TableField("enrollment_date")
    private LocalDateTime enrollmentDate;
    
    @TableField("completion_percentage")
    private BigDecimal completionPercentage;
    
    private EnrollmentStatus status;
    
    private BigDecimal grade;
    
    @TableField("certificate_url")
    private String certificateUrl;
    
    // 选课状态枚举
    public enum EnrollmentStatus {
        ACTIVE, COMPLETED, DROPPED
    }
    
    // 构造函数
    public CourseEnrollment() {}
    
    public CourseEnrollment(Long studentId, Long courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.enrollmentDate = LocalDateTime.now();
        this.completionPercentage = BigDecimal.ZERO;
        this.status = EnrollmentStatus.ACTIVE;
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
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }
    
    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
    
    public BigDecimal getCompletionPercentage() {
        return completionPercentage;
    }
    
    public void setCompletionPercentage(BigDecimal completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
    
    public EnrollmentStatus getStatus() {
        return status;
    }
    
    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }
    
    public BigDecimal getGrade() {
        return grade;
    }
    
    public void setGrade(BigDecimal grade) {
        this.grade = grade;
    }
    
    public String getCertificateUrl() {
        return certificateUrl;
    }
    
    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }
    
    @Override
    public String toString() {
        return "CourseEnrollment{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", courseId=" + courseId +
                ", status=" + status +
                ", completionPercentage=" + completionPercentage +
                '}';
    }
}