package com.education.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.education.system.entity.CourseActivity;
import com.education.system.mapper.CourseActivityMapper;
import com.education.system.service.CourseActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 课程活动服务实现类
 */
@Slf4j
@Service
public class CourseActivityServiceImpl extends ServiceImpl<CourseActivityMapper, CourseActivity> 
        implements CourseActivityService {

    @Override
    @Transactional
    public CourseActivity createActivity(CourseActivity activity) {
        // 设置默认值
        if (activity.getIsPublished() == null) {
            activity.setIsPublished(false);
        }
        if (activity.getIsRequired() == null) {
            activity.setIsRequired(true);
        }
        if (activity.getAttemptsAllowed() == null) {
            activity.setAttemptsAllowed(1);
        }
        if (activity.getAvailableFrom() == null) {
            activity.setAvailableFrom(LocalDateTime.now());
        }
        
        // 验证必要字段
        if (activity.getCourseId() == null) {
            throw new IllegalArgumentException("Course ID is required");
        }
        if (activity.getTeacherId() == null) {
            throw new IllegalArgumentException("Teacher ID is required");
        }
        
        save(activity);
        log.info("Created activity: {} for course: {} by teacher: {}", 
                activity.getTitle(), activity.getCourseId(), activity.getTeacherId());
        return activity;
    }

    @Override
    @Transactional
    public CourseActivity updateActivity(CourseActivity activity) {
        activity.setUpdatedAt(LocalDateTime.now());
        updateById(activity);
        log.info("Updated activity: {}", activity.getId());
        return activity;
    }

    @Override
    public CourseActivity getActivityById(Long id) {
        return getById(id);
    }

    @Override
    public List<CourseActivity> getActivitiesByCourseId(Long courseId) {
        return baseMapper.selectByCourseIdWithDetails(courseId);
    }

    @Override
    public IPage<CourseActivity> getActivitiesByTeacher(Long teacherId, String activityType, 
                                                       Page<CourseActivity> page) {
        return baseMapper.selectByTeacherIdAndType(page, teacherId, activityType);
    }

    @Override
    public List<CourseActivity> getActivitiesForStudent(Long studentId, String activityType) {
        return baseMapper.selectByStudentIdWithSubmission(studentId, activityType);
    }

    @Override
    @Transactional
    public Boolean publishActivity(Long id) {
        CourseActivity activity = getById(id);
        if (activity != null) {
            activity.setIsPublished(true);
            activity.setUpdatedAt(LocalDateTime.now());
            updateById(activity);
            log.info("Published activity: {}", id);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public Boolean unpublishActivity(Long id) {
        CourseActivity activity = getById(id);
        if (activity != null) {
            activity.setIsPublished(false);
            activity.setUpdatedAt(LocalDateTime.now());
            updateById(activity);
            log.info("Unpublished activity: {}", id);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public Boolean deleteActivity(Long id) {
        boolean result = removeById(id);
        if (result) {
            log.info("Deleted activity: {}", id);
        }
        return result;
    }

    @Override
    @Transactional
    public CourseActivity duplicateActivity(Long id, Long targetCourseId) {
        CourseActivity original = getById(id);
        if (original != null) {
            CourseActivity duplicate = new CourseActivity();
            BeanUtils.copyProperties(original, duplicate);
            duplicate.setId(null);
            duplicate.setCourseId(targetCourseId);
            duplicate.setTitle(original.getTitle() + " (Copy)");
            duplicate.setIsPublished(false);
            duplicate.setCreatedAt(LocalDateTime.now());
            duplicate.setUpdatedAt(LocalDateTime.now());
            
            save(duplicate);
            log.info("Duplicated activity {} to course {}", id, targetCourseId);
            return duplicate;
        }
        return null;
    }

    @Override
    public List<CourseActivity> getUpcomingActivities(int hours) {
        return baseMapper.selectUpcomingActivities(hours);
    }

    @Override
    public Map<String, Object> getActivityStatistics(Long teacherId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 查询活动总数
        QueryWrapper<CourseActivity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("teacher_id", teacherId);
        long totalCount = count(queryWrapper);
        statistics.put("totalActivities", totalCount);
        
        // 按类型统计
        List<Object> typeStats = baseMapper.countActivitiesByType(teacherId);
        statistics.put("activityTypeStats", typeStats);
        
        // 已发布数量
        queryWrapper.clear();
        queryWrapper.eq("teacher_id", teacherId).eq("is_published", true);
        long publishedCount = count(queryWrapper);
        statistics.put("publishedActivities", publishedCount);
        
        return statistics;
    }

    @Override
    @Transactional
    public List<CourseActivity> batchCreateActivities(List<CourseActivity> activities) {
        saveBatch(activities);
        log.info("Batch created {} activities", activities.size());
        return activities;
    }

    @Override
    public CourseActivity getActivityTemplate(String activityType) {
        CourseActivity template = new CourseActivity();
        template.setActivityType(activityType);
        template.setIsPublished(false);
        template.setIsRequired(true);
        template.setAttemptsAllowed(1);
        template.setAvailableFrom(LocalDateTime.now());
        
        switch (activityType) {
            case "ASSIGNMENT":
                template.setTitle("New Assignment");
                template.setSubmissionType("FILE");
                template.setGradingMethod("MANUAL");
                template.setMaxScore(new java.math.BigDecimal("100"));
                break;
            case "QUIZ":
                template.setTitle("New Quiz");
                template.setSubmissionType("MULTIPLE_CHOICE");
                template.setGradingMethod("AUTO");
                template.setTimeLimitMinutes(60);
                template.setMaxScore(new java.math.BigDecimal("50"));
                break;
            case "ANNOUNCEMENT":
                template.setTitle("New Announcement");
                template.setSubmissionType("TEXT");
                template.setMaxScore(new java.math.BigDecimal("0"));
                break;
            case "PRACTICE":
                template.setTitle("New Practice");
                template.setSubmissionType("TEXT");
                template.setGradingMethod("AUTO");
                template.setAttemptsAllowed(-1); // Unlimited attempts
                template.setMaxScore(new java.math.BigDecimal("25"));
                break;
            default:
                template.setTitle("New Activity");
                template.setSubmissionType("TEXT");
                template.setGradingMethod("MANUAL");
                break;
        }
        
        return template;
    }
}