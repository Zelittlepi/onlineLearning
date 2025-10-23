package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.LearningProgress;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 学习进度数据访问接口
 */
@Mapper
public interface LearningProgressMapper extends BaseMapper<LearningProgress> {
    
    /**
     * 根据学生ID查询学习进度
     * @param studentId 学生ID
     * @return 学习进度列表
     */
    @Select("SELECT * FROM learning_progress WHERE student_id = #{studentId} ORDER BY last_accessed DESC")
    List<LearningProgress> findByStudentId(Long studentId);
    
    /**
     * 根据内容ID查询学习进度
     * @param contentId 内容ID
     * @return 学习进度列表
     */
    @Select("SELECT * FROM learning_progress WHERE content_id = #{contentId}")
    List<LearningProgress> findByContentId(Long contentId);
    
    /**
     * 根据学生ID和内容ID查询学习进度
     * @param studentId 学生ID
     * @param contentId 内容ID
     * @return 学习进度
     */
    @Select("SELECT * FROM learning_progress WHERE student_id = #{studentId} AND content_id = #{contentId}")
    LearningProgress findByStudentIdAndContentId(Long studentId, Long contentId);
    
    /**
     * 根据学生ID查询已完成的学习进度
     * @param studentId 学生ID
     * @return 已完成的学习进度列表
     */
    @Select("SELECT * FROM learning_progress WHERE student_id = #{studentId} AND is_completed = true ORDER BY completion_date DESC")
    List<LearningProgress> findCompletedByStudentId(Long studentId);
}