package com.education.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

/**
 * 测试控制器
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TestController {

    @Autowired
    private DataSource dataSource;

    /**
     * 测试数据库连接
     */
    @GetMapping("/db-connection")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            result.put("connected", true);
            result.put("database", connection.getMetaData().getDatabaseProductName());
            result.put("url", connection.getMetaData().getURL());
            
            // 检查course_activities表是否存在
            try (Statement stmt = connection.createStatement();
                 ResultSet rs = stmt.executeQuery("SHOW TABLES LIKE 'course_activities'")) {
                
                boolean tableExists = rs.next();
                result.put("course_activities_table_exists", tableExists);
                
                if (tableExists) {
                    // 检查表结构
                    try (ResultSet columnsRs = stmt.executeQuery("DESCRIBE course_activities")) {
                        result.put("table_structure", "Table exists");
                    }
                }
            }
            
        } catch (Exception e) {
            result.put("connected", false);
            result.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }
}