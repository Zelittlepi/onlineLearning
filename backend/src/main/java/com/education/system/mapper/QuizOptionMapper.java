package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.QuizOption;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 测验选项Mapper接口
 */
@Mapper
public interface QuizOptionMapper extends BaseMapper<QuizOption> {

    /**
     * 根据题目ID查询选项列表
     */
    @Select("SELECT * FROM quiz_options " +
            "WHERE question_id = #{questionId} " +
            "ORDER BY order_index ASC")
    List<QuizOption> selectByQuestionId(@Param("questionId") Long questionId);

    /**
     * 查询正确答案选项
     */
    @Select("SELECT * FROM quiz_options " +
            "WHERE question_id = #{questionId} AND is_correct = true")
    List<QuizOption> selectCorrectOptions(@Param("questionId") Long questionId);
}