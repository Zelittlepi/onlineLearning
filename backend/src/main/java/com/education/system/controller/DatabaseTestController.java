package com.education.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
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
}