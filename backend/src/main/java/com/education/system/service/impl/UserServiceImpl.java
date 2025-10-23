package com.education.system.service.impl;

import com.education.system.entity.User;
import com.education.system.mapper.UserMapper;
import com.education.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;
    
    @Override
    public Optional<User> findByUsername(String username) {
        try {
            System.out.println("查询用户名: " + username);
            Optional<User> result = userMapper.findByUsername(username);
            System.out.println("查询结果: " + (result.isPresent() ? "找到用户" : "用户不存在"));
            return result;
        } catch (Exception e) {
            System.err.println("查询用户名失败: " + e.getMessage());
            // 重试一次
            try {
                Thread.sleep(1000);
                System.out.println("重试查询用户名: " + username);
                return userMapper.findByUsername(username);
            } catch (Exception retryException) {
                System.err.println("重试查询用户名也失败: " + retryException.getMessage());
                throw new RuntimeException("数据库连接失败，请稍后重试", retryException);
            }
        }
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        try {
            System.out.println("查询邮箱: " + email);
            Optional<User> result = userMapper.findByEmail(email);
            System.out.println("查询结果: " + (result.isPresent() ? "找到用户" : "邮箱不存在"));
            return result;
        } catch (Exception e) {
            System.err.println("查询邮箱失败: " + e.getMessage());
            // 重试一次
            try {
                Thread.sleep(1000);
                System.out.println("重试查询邮箱: " + email);
                return userMapper.findByEmail(email);
            } catch (Exception retryException) {
                System.err.println("重试查询邮箱也失败: " + retryException.getMessage());
                throw new RuntimeException("数据库连接失败，请稍后重试", retryException);
            }
        }
    }
    
    @Override
    @Transactional
    public User save(User user) {
        try {
            if (user.getId() == null) {
                // 设置创建和更新时间
                if (user.getCreatedAt() == null) {
                    user.setCreatedAt(LocalDateTime.now());
                }
                if (user.getUpdatedAt() == null) {
                    user.setUpdatedAt(LocalDateTime.now());
                }
                
                System.out.println("准备插入用户: " + user.getUsername());
                int result = userMapper.insert(user);
                System.out.println("插入用户结果: " + result + ", 用户ID: " + user.getId());
            } else {
                user.setUpdatedAt(LocalDateTime.now());
                userMapper.updateById(user);
                System.out.println("更新用户ID: " + user.getId());
            }
            return user;
        } catch (Exception e) {
            System.err.println("保存用户失败: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("保存用户失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    @Transactional
    public User createUser(String username, String password, String email, String fullName, User.UserRole role) {
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(username, encodedPassword, email, fullName, role);
        
        System.out.println("正在创建用户: " + username + ", 邮箱: " + email + ", 角色: " + role);
        User savedUser = save(user);
        System.out.println("用户创建成功，ID: " + savedUser.getId());
        
        return savedUser;
    }
}