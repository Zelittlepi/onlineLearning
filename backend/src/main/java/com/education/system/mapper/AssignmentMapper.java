package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.Assignment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 作业数据访问接口
 */
@Mapper
public interface AssignmentMapper extends BaseMapper<Assignment> {
    
    /**
     * 根据课程ID查询作业列表
     * @param courseId 课程ID
     * @return 作业列表
     */
    @Select("SELECT * FROM assignments WHERE course_id = #{courseId} ORDER BY created_at DESC")
    List<Assignment> findByCourseId(Long courseId);
    
    /**
     * 根据课程ID和发布状态查询作业列表
     * @param courseId 课程ID
     * @param isPublished 是否发布
     * @return 作业列表
     */
    @Select("SELECT * FROM assignments WHERE course_id = #{courseId} AND is_published = #{isPublished} ORDER BY created_at DESC")
    List<Assignment> findByCourseIdAndPublished(Long courseId, Boolean isPublished);
}