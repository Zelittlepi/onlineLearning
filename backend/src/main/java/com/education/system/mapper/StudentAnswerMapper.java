package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.StudentAnswer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 学生答案Mapper接口
 */
@Mapper
public interface StudentAnswerMapper extends BaseMapper<StudentAnswer> {

    /**
     * 根据提交ID查询学生答案
     */
    @Select("SELECT sa.*, qq.question_text, qq.question_type, qq.points " +
            "FROM student_answers sa " +
            "LEFT JOIN quiz_questions qq ON sa.question_id = qq.id " +
            "WHERE sa.submission_id = #{submissionId} " +
            "ORDER BY qq.order_index ASC")
    List<StudentAnswer> selectBySubmissionId(@Param("submissionId") Long submissionId);

    /**
     * 根据提交ID和题目ID查询答案
     */
    @Select("SELECT * FROM student_answers " +
            "WHERE submission_id = #{submissionId} AND question_id = #{questionId}")
    StudentAnswer selectBySubmissionAndQuestion(@Param("submissionId") Long submissionId, 
                                               @Param("questionId") Long questionId);
}