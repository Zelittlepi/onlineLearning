package com.education.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.education.system.entity.CourseChapter;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 课程章节数据访问接口
 */
@Mapper
public interface CourseChapterMapper extends BaseMapper<CourseChapter> {
    
    /**
     * 根据课程ID查询章节列表
     * @param courseId 课程ID
     * @return 章节列表
     */
    @Select("SELECT * FROM course_chapters WHERE course_id = #{courseId} ORDER BY order_index ASC")
    List<CourseChapter> findByCourseId(Long courseId);
}