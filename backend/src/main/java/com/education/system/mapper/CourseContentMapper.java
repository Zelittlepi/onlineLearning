package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.CourseContent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 课程内容数据访问接口
 */
@Mapper
public interface CourseContentMapper extends BaseMapper<CourseContent> {
    
    /**
     * 根据章节ID查询内容列表
     * @param chapterId 章节ID
     * @return 内容列表
     */
    @Select("SELECT * FROM course_contents WHERE chapter_id = #{chapterId} ORDER BY order_index ASC")
    List<CourseContent> findByChapterId(Long chapterId);
}