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
        return userMapper.findByUsername(username);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return userMapper.findByEmail(email);
    }
    
    @Override
    @Transactional
    public User save(User user) {
        if (user.getId() == null) {
            // 设置创建和更新时间
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(LocalDateTime.now());
            }
            if (user.getUpdatedAt() == null) {
                user.setUpdatedAt(LocalDateTime.now());
            }
            
            int result = userMapper.insert(user);
            System.out.println("插入用户结果: " + result + ", 用户ID: " + user.getId());
        } else {
            user.setUpdatedAt(LocalDateTime.now());
            userMapper.updateById(user);
            System.out.println("更新用户ID: " + user.getId());
        }
        return user;
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