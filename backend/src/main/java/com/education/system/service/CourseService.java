package com.education.system.service;

import com.education.system.entity.Course;
import com.education.system.entity.CourseChapter;
import com.education.system.entity.CourseContent;
import com.education.system.mapper.CourseMapper;
import com.education.system.mapper.CourseChapterMapper;
import com.education.system.mapper.CourseContentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 课程服务类
 */
@Service
public class CourseService {
    
    @Autowired
    private CourseMapper courseMapper;
    
    @Autowired
    private CourseChapterMapper chapterMapper;
    
    @Autowired
    private CourseContentMapper contentMapper;
    
    /**
     * 根据教师ID获取课程列表
     */
    public List<Course> getCoursesByTeacher(Long teacherId) {
        return courseMapper.findByTeacherId(teacherId);
    }
    
    /**
     * 创建课程
     */
    @Transactional
    public Course createCourse(Course course) {
        courseMapper.insert(course);
        return course;
    }
    
    /**
     * 更新课程
     */
    @Transactional
    public Course updateCourse(Course course) {
        courseMapper.updateById(course);
        return course;
    }
    
    /**
     * 删除课程
     */
    @Transactional
    public void deleteCourse(Long courseId) {
        courseMapper.deleteById(courseId);
    }
    
    /**
     * 获取课程详情（包含章节和内容）
     */
    public Course getCourseWithDetails(Long courseId) {
        return courseMapper.selectById(courseId);
    }
    
    /**
     * 获取课程章节
     */
    public List<CourseChapter> getChaptersByCourse(Long courseId) {
        return chapterMapper.findByCourseId(courseId);
    }
    
    /**
     * 创建章节
     */
    @Transactional
    public CourseChapter createChapter(CourseChapter chapter) {
        chapterMapper.insert(chapter);
        return chapter;
    }
    
    /**
     * 更新章节
     */
    @Transactional
    public CourseChapter updateChapter(CourseChapter chapter) {
        chapterMapper.updateById(chapter);
        return chapter;
    }
    
    /**
     * 删除章节
     */
    @Transactional
    public void deleteChapter(Long chapterId) {
        chapterMapper.deleteById(chapterId);
    }
    
    /**
     * 获取章节内容
     */
    public List<CourseContent> getContentsByChapter(Long chapterId) {
        return contentMapper.findByChapterId(chapterId);
    }
    
    /**
     * 创建内容
     */
    @Transactional
    public CourseContent createContent(CourseContent content) {
        contentMapper.insert(content);
        return content;
    }
    
    /**
     * 更新内容
     */
    @Transactional
    public CourseContent updateContent(CourseContent content) {
        contentMapper.updateById(content);
        return content;
    }
    
    /**
     * 删除内容
     */
    @Transactional
    public void deleteContent(Long contentId) {
        contentMapper.deleteById(contentId);
    }
}