package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.system.entity.CourseActivity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 课程活动Mapper接口
 */
@Mapper
public interface CourseActivityMapper extends BaseMapper<CourseActivity> {

    /**
     * 根据课程ID查询活动列表（包含课程信息）
     */
    @Select("SELECT ca.*, c.title as course_name, u.full_name as teacher_name " +
            "FROM course_activities ca " +
            "LEFT JOIN courses c ON ca.course_id = c.id " +
            "LEFT JOIN users u ON c.teacher_id = u.id " +
            "WHERE ca.course_id = #{courseId} " +
            "AND ca.is_published = true " +
            "ORDER BY ca.due_date ASC, ca.created_at DESC")
    List<CourseActivity> selectByCourseIdWithDetails(@Param("courseId") Long courseId);

    /**
     * 根据教师ID查询活动列表（分页）
     */
    @Select("SELECT ca.*, c.title as course_name " +
            "FROM course_activities ca " +
            "LEFT JOIN courses c ON ca.course_id = c.id " +
            "WHERE ca.teacher_id = #{teacherId} " +
            "AND (#{activityType} IS NULL OR ca.activity_type = #{activityType}) " +
            "ORDER BY ca.created_at DESC")
    IPage<CourseActivity> selectByTeacherIdAndType(Page<CourseActivity> page, 
                                                   @Param("teacherId") Long teacherId, 
                                                   @Param("activityType") String activityType);

    /**
     * 根据学生ID查询活动列表（包含提交状态）
     */
    @Select("SELECT ca.*, c.title as course_name, u.full_name as teacher_name, " +
            "asub.id as submission_id, asub.status as submission_status, " +
            "asub.score as submission_score, asub.submitted_at as submission_date " +
            "FROM course_activities ca " +
            "LEFT JOIN courses c ON ca.course_id = c.id " +
            "LEFT JOIN users u ON c.teacher_id = u.id " +
            "LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.student_id = #{studentId} " +
            "LEFT JOIN activity_submissions asub ON ca.id = asub.activity_id AND asub.student_id = #{studentId} AND asub.is_final = true " +
            "WHERE ce.status = 'ACTIVE' " +
            "AND ca.is_published = true " +
            "AND (#{activityType} IS NULL OR ca.activity_type = #{activityType}) " +
            "ORDER BY ca.due_date ASC, ca.created_at DESC")
    List<CourseActivity> selectByStudentIdWithSubmission(@Param("studentId") Long studentId, 
                                                         @Param("activityType") String activityType);

    /**
     * 查询即将到期的活动（用于通知）
     */
    @Select("SELECT ca.*, c.title as course_name " +
            "FROM course_activities ca " +
            "LEFT JOIN courses c ON ca.course_id = c.id " +
            "WHERE ca.due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL #{hours} HOUR) " +
            "AND ca.is_published = true " +
            "AND ca.activity_type IN ('ASSIGNMENT', 'QUIZ')")
    List<CourseActivity> selectUpcomingActivities(@Param("hours") int hours);

    /**
     * 统计活动数量（按类型）
     */
    @Select("SELECT activity_type, COUNT(*) as count " +
            "FROM course_activities ca " +
            "LEFT JOIN courses c ON ca.course_id = c.id " +
            "WHERE c.teacher_id = #{teacherId} " +
            "GROUP BY activity_type")
    List<Object> countActivitiesByType(@Param("teacherId") Long teacherId);
}