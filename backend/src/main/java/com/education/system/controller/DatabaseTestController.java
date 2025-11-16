package com.education.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * 数据库测试控制器
 */
@RestController
@RequestMapping("/api/test")
public class DatabaseTestController {

    @Autowired
    private DataSource dataSource;

    /**
     * 测试数据库连接并检查表是否存在
     */
    @GetMapping("/database")
    public ResponseEntity<?> testDatabase() {
        try {
            List<String> tables = new ArrayList<>();
            
            try (Connection connection = dataSource.getConnection()) {
                DatabaseMetaData metaData = connection.getMetaData();
                
                // 检查关键表是否存在
                String[] tableNames = {"users", "courses", "course_activities"};
                
                for (String tableName : tableNames) {
                    ResultSet resultSet = metaData.getTables(null, null, tableName, null);
                    if (resultSet.next()) {
                        tables.add(tableName + " - EXISTS");
                    } else {
                        tables.add(tableName + " - NOT EXISTS");
                    }
                }
                
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("status", "success");
                response.put("message", "Database connection successful");
                response.put("tables", tables);
                response.put("database", metaData.getDatabaseProductName());
                response.put("url", connection.getMetaData().getURL());
                return ResponseEntity.ok().body(response);
            }
        } catch (Exception e) {
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Database connection failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 检查学生选课和活动数据
     */
    @GetMapping("/student-activities/{studentId}")
    public ResponseEntity<?> checkStudentData(@PathVariable Long studentId) {
        try {
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            
            try (Connection connection = dataSource.getConnection()) {
                // 查询学生信息
                PreparedStatement userStmt = connection.prepareStatement(
                    "SELECT id, username, full_name, role FROM users WHERE id = ?");
                userStmt.setLong(1, studentId);
                ResultSet userResult = userStmt.executeQuery();
                
                if (userResult.next()) {
                    java.util.Map<String, Object> user = new java.util.HashMap<>();
                    user.put("id", userResult.getLong("id"));
                    user.put("username", userResult.getString("username"));
                    user.put("fullName", userResult.getString("full_name"));
                    user.put("role", userResult.getString("role"));
                    response.put("user", user);
                } else {
                    response.put("user", "NOT FOUND");
                }
                
                // 查询学生选课
                PreparedStatement enrollmentStmt = connection.prepareStatement(
                    "SELECT ce.*, c.title as course_title FROM course_enrollments ce " +
                    "LEFT JOIN courses c ON ce.course_id = c.id WHERE ce.student_id = ?");
                enrollmentStmt.setLong(1, studentId);
                ResultSet enrollmentResult = enrollmentStmt.executeQuery();
                
                List<java.util.Map<String, Object>> enrollments = new ArrayList<>();
                while (enrollmentResult.next()) {
                    java.util.Map<String, Object> enrollment = new java.util.HashMap<>();
                    enrollment.put("courseId", enrollmentResult.getLong("course_id"));
                    enrollment.put("courseTitle", enrollmentResult.getString("course_title"));
                    enrollment.put("status", enrollmentResult.getString("status"));
                    enrollment.put("completionPercentage", enrollmentResult.getDouble("completion_percentage"));
                    enrollments.add(enrollment);
                }
                response.put("enrollments", enrollments);
                
                // 查询学生可见的活动
                PreparedStatement activityStmt = connection.prepareStatement(
                    "SELECT ca.id, ca.title, ca.activity_type, ca.is_published, c.title as course_title " +
                    "FROM course_activities ca " +
                    "LEFT JOIN courses c ON ca.course_id = c.id " +
                    "LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.student_id = ? " +
                    "WHERE ce.status = 'ACTIVE' AND ca.is_published = true " +
                    "ORDER BY ca.created_at DESC");
                activityStmt.setLong(1, studentId);
                ResultSet activityResult = activityStmt.executeQuery();
                
                List<java.util.Map<String, Object>> activities = new ArrayList<>();
                while (activityResult.next()) {
                    java.util.Map<String, Object> activity = new java.util.HashMap<>();
                    activity.put("id", activityResult.getLong("id"));
                    activity.put("title", activityResult.getString("title"));
                    activity.put("activityType", activityResult.getString("activity_type"));
                    activity.put("courseTitle", activityResult.getString("course_title"));
                    activity.put("isPublished", activityResult.getBoolean("is_published"));
                    activities.add(activity);
                }
                response.put("activities", activities);
                
                response.put("status", "success");
                return ResponseEntity.ok().body(response);
            }
        } catch (Exception e) {
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to check student data: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 检查特定课程的活动数据
     */
    @GetMapping("/course-activities/{courseId}")
    public ResponseEntity<?> checkCourseActivities(@PathVariable Long courseId) {
        try {
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            
            try (Connection connection = dataSource.getConnection()) {
                // 查询课程信息
                PreparedStatement courseStmt = connection.prepareStatement(
                    "SELECT id, title, teacher_id, status FROM courses WHERE id = ?");
                courseStmt.setLong(1, courseId);
                ResultSet courseResult = courseStmt.executeQuery();
                
                if (courseResult.next()) {
                    java.util.Map<String, Object> course = new java.util.HashMap<>();
                    course.put("id", courseResult.getLong("id"));
                    course.put("title", courseResult.getString("title"));
                    course.put("teacherId", courseResult.getLong("teacher_id"));
                    course.put("status", courseResult.getString("status"));
                    response.put("course", course);
                } else {
                    response.put("course", "NOT FOUND");
                }
                
                // 查询该课程的所有活动（包括未发布的）
                PreparedStatement allActivitiesStmt = connection.prepareStatement(
                    "SELECT id, title, activity_type, is_published, due_date, created_at " +
                    "FROM course_activities WHERE course_id = ? ORDER BY created_at DESC");
                allActivitiesStmt.setLong(1, courseId);
                ResultSet allActivitiesResult = allActivitiesStmt.executeQuery();
                
                List<java.util.Map<String, Object>> allActivities = new ArrayList<>();
                while (allActivitiesResult.next()) {
                    java.util.Map<String, Object> activity = new java.util.HashMap<>();
                    activity.put("id", allActivitiesResult.getLong("id"));
                    activity.put("title", allActivitiesResult.getString("title"));
                    activity.put("activityType", allActivitiesResult.getString("activity_type"));
                    activity.put("isPublished", allActivitiesResult.getBoolean("is_published"));
                    activity.put("dueDate", allActivitiesResult.getTimestamp("due_date"));
                    activity.put("createdAt", allActivitiesResult.getTimestamp("created_at"));
                    allActivities.add(activity);
                }
                response.put("allActivities", allActivities);
                
                response.put("status", "success");
                return ResponseEntity.ok().body(response);
            }
        } catch (Exception e) {
            java.util.Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to check course activities: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}