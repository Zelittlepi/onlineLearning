package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.AssignmentSubmission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 作业提交数据访问接口
 */
@Mapper
public interface AssignmentSubmissionMapper extends BaseMapper<AssignmentSubmission> {
    
    /**
     * 根据作业ID查询提交列表
     * @param assignmentId 作业ID
     * @return 提交列表
     */
    @Select("SELECT * FROM assignment_submissions WHERE assignment_id = #{assignmentId} ORDER BY submitted_at DESC")
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    
    /**
     * 根据学生ID查询提交列表
     * @param studentId 学生ID
     * @return 提交列表
     */
    @Select("SELECT * FROM assignment_submissions WHERE student_id = #{studentId} ORDER BY submitted_at DESC")
    List<AssignmentSubmission> findByStudentId(Long studentId);
    
    /**
     * 根据作业ID和学生ID查询提交记录
     * @param assignmentId 作业ID
     * @param studentId 学生ID
     * @return 提交记录
     */
    @Select("SELECT * FROM assignment_submissions WHERE assignment_id = #{assignmentId} AND student_id = #{studentId}")
    AssignmentSubmission findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
}