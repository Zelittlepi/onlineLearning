package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.QuizQuestion;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 测验题目Mapper接口
 */
@Mapper
public interface QuizQuestionMapper extends BaseMapper<QuizQuestion> {

    /**
     * 根据活动ID查询题目列表（包含选项）
     */
    @Select("SELECT * FROM quiz_questions " +
            "WHERE activity_id = #{activityId} " +
            "ORDER BY order_index ASC")
    List<QuizQuestion> selectByActivityId(@Param("activityId") Long activityId);

    /**
     * 查询题目及其选项
     */
    @Select("SELECT qq.*, qo.id as option_id, qo.option_text, qo.is_correct as option_correct, " +
            "qo.order_index as option_order, qo.explanation as option_explanation " +
            "FROM quiz_questions qq " +
            "LEFT JOIN quiz_options qo ON qq.id = qo.question_id " +
            "WHERE qq.activity_id = #{activityId} " +
            "ORDER BY qq.order_index ASC, qo.order_index ASC")
    List<Object> selectQuestionsWithOptions(@Param("activityId") Long activityId);

    /**
     * 统计题目总分
     */
    @Select("SELECT SUM(points) FROM quiz_questions WHERE activity_id = #{activityId}")
    Double sumPointsByActivityId(@Param("activityId") Long activityId);
}