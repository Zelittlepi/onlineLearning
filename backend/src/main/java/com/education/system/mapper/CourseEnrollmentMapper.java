package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.CourseEnrollment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 学生选课数据访问接口
 */
@Mapper
public interface CourseEnrollmentMapper extends BaseMapper<CourseEnrollment> {
    
    /**
     * 根据学生ID查询选课列表
     * @param studentId 学生ID
     * @return 选课列表
     */
    @Select("SELECT * FROM course_enrollments WHERE student_id = #{studentId} ORDER BY enrollment_date DESC")
    List<CourseEnrollment> findByStudentId(Long studentId);
    
    /**
     * 根据课程ID查询选课学生列表
     * @param courseId 课程ID
     * @return 选课列表
     */
    @Select("SELECT * FROM course_enrollments WHERE course_id = #{courseId} ORDER BY enrollment_date DESC")
    List<CourseEnrollment> findByCourseId(Long courseId);
    
    /**
     * 根据学生ID和课程ID查询选课记录
     * @param studentId 学生ID
     * @param courseId 课程ID
     * @return 选课记录
     */
    @Select("SELECT * FROM course_enrollments WHERE student_id = #{studentId} AND course_id = #{courseId}")
    CourseEnrollment findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    /**
     * 根据学生ID和状态查询选课列表
     * @param studentId 学生ID
     * @param status 选课状态
     * @return 选课列表
     */
    @Select("SELECT * FROM course_enrollments WHERE student_id = #{studentId} AND status = #{status} ORDER BY enrollment_date DESC")
    List<CourseEnrollment> findByStudentIdAndStatus(Long studentId, String status);
}