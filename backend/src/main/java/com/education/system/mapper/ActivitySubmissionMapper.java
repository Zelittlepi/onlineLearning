package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.education.system.entity.ActivitySubmission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 活动提交Mapper接口
 */
@Mapper
public interface ActivitySubmissionMapper extends BaseMapper<ActivitySubmission> {

    /**
     * 根据活动ID查询提交列表（包含学生信息）
     */
    @Select("SELECT asub.*, u.full_name as student_name, u.username as student_username " +
            "FROM activity_submissions asub " +
            "LEFT JOIN users u ON asub.student_id = u.id " +
            "WHERE asub.activity_id = #{activityId} " +
            "AND asub.is_final = true " +
            "ORDER BY asub.submitted_at DESC")
    List<ActivitySubmission> selectByActivityIdWithStudentInfo(@Param("activityId") Long activityId);

    /**
     * 根据学生ID和活动ID查询提交记录
     */
    @Select("SELECT * FROM activity_submissions " +
            "WHERE student_id = #{studentId} AND activity_id = #{activityId} " +
            "ORDER BY attempt_number DESC")
    List<ActivitySubmission> selectByStudentAndActivity(@Param("studentId") Long studentId, 
                                                        @Param("activityId") Long activityId);

    /**
     * 查询待评分的提交（教师视图）
     */
    @Select("SELECT asub.*, ca.title as activity_title, ca.activity_type, " +
            "u.full_name as student_name, c.title as course_name " +
            "FROM activity_submissions asub " +
            "LEFT JOIN course_activities ca ON asub.activity_id = ca.id " +
            "LEFT JOIN courses c ON ca.course_id = c.id " +
            "LEFT JOIN users u ON asub.student_id = u.id " +
            "WHERE c.teacher_id = #{teacherId} " +
            "AND asub.status = 'SUBMITTED' " +
            "AND asub.is_final = true " +
            "AND ca.grading_method = 'MANUAL' " +
            "ORDER BY asub.submitted_at ASC")
    IPage<ActivitySubmission> selectPendingGrading(Page<ActivitySubmission> page, 
                                                   @Param("teacherId") Long teacherId);

    /**
     * 查询学生的活动统计
     */
    @Select("SELECT " +
            "COUNT(CASE WHEN asub.status = 'SUBMITTED' THEN 1 END) as submitted_count, " +
            "COUNT(CASE WHEN asub.status = 'GRADED' THEN 1 END) as graded_count, " +
            "AVG(CASE WHEN asub.score IS NOT NULL THEN asub.score END) as avg_score " +
            "FROM activity_submissions asub " +
            "LEFT JOIN course_activities ca ON asub.activity_id = ca.id " +
            "LEFT JOIN courses c ON ca.course_id = c.id " +
            "WHERE asub.student_id = #{studentId} " +
            "AND asub.is_final = true " +
            "AND c.id = #{courseId}")
    Object selectStudentStatistics(@Param("studentId") Long studentId, 
                                  @Param("courseId") Long courseId);

    /**
     * 查询逾期提交
     */
    @Select("SELECT asub.*, ca.title as activity_title, ca.due_date, " +
            "u.full_name as student_name " +
            "FROM activity_submissions asub " +
            "LEFT JOIN course_activities ca ON asub.activity_id = ca.id " +
            "LEFT JOIN users u ON asub.student_id = u.id " +
            "WHERE asub.submitted_at > ca.due_date " +
            "AND asub.is_final = true " +
            "ORDER BY asub.submitted_at DESC")
    List<ActivitySubmission> selectLateSubmissions();
}