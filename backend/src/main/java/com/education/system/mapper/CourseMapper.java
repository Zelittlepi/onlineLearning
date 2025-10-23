package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 课程数据访问接口
 */
@Mapper
public interface CourseMapper extends BaseMapper<Course> {
    
    /**
     * 根据教师ID查询课程列表
     * @param teacherId 教师ID
     * @return 课程列表
     */
    @Select("SELECT * FROM courses WHERE teacher_id = #{teacherId} ORDER BY created_at DESC")
    List<Course> findByTeacherId(Long teacherId);
    
    /**
     * 根据状态查询课程列表
     * @param status 课程状态
     * @return 课程列表
     */
    @Select("SELECT * FROM courses WHERE status = #{status} ORDER BY created_at DESC")
    List<Course> findByStatus(String status);
    
    /**
     * 根据教师ID和状态查询课程列表
     * @param teacherId 教师ID
     * @param status 课程状态
     * @return 课程列表
     */
    @Select("SELECT * FROM courses WHERE teacher_id = #{teacherId} AND status = #{status} ORDER BY created_at DESC")
    List<Course> findByTeacherIdAndStatus(Long teacherId, String status);
}