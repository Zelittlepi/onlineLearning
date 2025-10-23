package com.education.system.service;

import com.education.system.entity.Assignment;
import com.education.system.entity.AssignmentSubmission;
import com.education.system.mapper.AssignmentMapper;
import com.education.system.mapper.AssignmentSubmissionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 作业服务类
 */
@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentMapper assignmentMapper;
    
    @Autowired
    private AssignmentSubmissionMapper submissionMapper;
    
    /**
     * 根据课程ID获取作业列表
     */
    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentMapper.findByCourseId(courseId);
    }
    
    /**
     * 创建作业
     */
    @Transactional
    public Assignment createAssignment(Assignment assignment) {
        assignmentMapper.insert(assignment);
        return assignment;
    }
    
    /**
     * 更新作业
     */
    @Transactional
    public Assignment updateAssignment(Assignment assignment) {
        assignmentMapper.updateById(assignment);
        return assignment;
    }
    
    /**
     * 删除作业
     */
    @Transactional
    public void deleteAssignment(Long assignmentId) {
        assignmentMapper.deleteById(assignmentId);
    }
    
    /**
     * 发布作业
     */
    @Transactional
    public void publishAssignment(Long assignmentId) {
        Assignment assignment = assignmentMapper.selectById(assignmentId);
        if (assignment != null) {
            assignment.setIsPublished(true);
            assignmentMapper.updateById(assignment);
        }
    }
    
    /**
     * 获取作业提交列表
     */
    public List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionMapper.findByAssignmentId(assignmentId);
    }
    
    /**
     * 批改作业
     */
    @Transactional
    public AssignmentSubmission gradeSubmission(Long submissionId, java.math.BigDecimal score, String feedback, Long graderId) {
        AssignmentSubmission submission = submissionMapper.selectById(submissionId);
        if (submission != null) {
            submission.setScore(score);
            submission.setFeedback(feedback);
            submission.setGradedBy(graderId);
            submission.setGradedAt(LocalDateTime.now());
            submission.setStatus(AssignmentSubmission.SubmissionStatus.GRADED);
            submissionMapper.updateById(submission);
        }
        return submission;
    }
}