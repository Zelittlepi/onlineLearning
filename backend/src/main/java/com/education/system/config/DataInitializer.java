package com.education.system.config;

import com.education.system.entity.User;
import com.education.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserService userService;
    
    @Override
    public void run(String... args) throws Exception {
        // 只有在数据库为空时才创建测试用户
        System.out.println("=== 数据库初始化检查 ===");
        
        if (!userService.findByUsername("teacher1").isPresent()) {
            userService.createUser(
                "teacher1", 
                "password123", 
                "teacher1@example.com", 
                "John Teacher", 
                User.UserRole.TEACHER
            );
            System.out.println("✅ 创建测试教师账户: teacher1/password123");
        } else {
            System.out.println("⚠️  测试教师账户已存在，跳过创建");
        }
        
        if (!userService.findByUsername("student1").isPresent()) {
            userService.createUser(
                "student1", 
                "password123", 
                "student1@example.com", 
                "Jane Student", 
                User.UserRole.STUDENT
            );
            System.out.println("✅ 创建测试学生账户: student1/password123");
        } else {
            System.out.println("⚠️  测试学生账户已存在，跳过创建");
        }
        
        System.out.println("=== 数据库初始化完成 ===");
    }
}