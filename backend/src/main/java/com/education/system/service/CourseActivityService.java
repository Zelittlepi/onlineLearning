package com.education.system.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.education.system.entity.CourseActivity;

import java.util.List;
import java.util.Map;

/**
 * 课程活动服务接口
 */
public interface CourseActivityService extends IService<CourseActivity> {

    /**
     * 创建课程活动
     */
    CourseActivity createActivity(CourseActivity activity);

    /**
     * 更新课程活动
     */
    CourseActivity updateActivity(CourseActivity activity);

    /**
     * 根据ID获取活动详情
     */
    CourseActivity getActivityById(Long id);

    /**
     * 根据课程ID获取活动列表
     */
    List<CourseActivity> getActivitiesByCourseId(Long courseId);

    /**
     * 根据教师ID和活动类型分页查询活动
     */
    IPage<CourseActivity> getActivitiesByTeacher(Long teacherId, String activityType, 
                                                Page<CourseActivity> page);

    /**
     * 根据学生ID获取活动列表（包含提交状态）
     */
    List<CourseActivity> getActivitiesForStudent(Long studentId, String activityType);

    /**
     * 发布活动
     */
    Boolean publishActivity(Long id);

    /**
     * 取消发布活动
     */
    Boolean unpublishActivity(Long id);

    /**
     * 删除活动
     */
    Boolean deleteActivity(Long id);

    /**
     * 复制活动
     */
    CourseActivity duplicateActivity(Long id, Long targetCourseId);

    /**
     * 获取即将到期的活动
     */
    List<CourseActivity> getUpcomingActivities(int hours);

    /**
     * 获取活动统计信息
     */
    Map<String, Object> getActivityStatistics(Long teacherId);

    /**
     * 批量创建活动
     */
    List<CourseActivity> batchCreateActivities(List<CourseActivity> activities);

    /**
     * 根据活动类型获取模板
     */
    CourseActivity getActivityTemplate(String activityType);
}