package com.education.system.controller;

import com.education.system.dto.LoginRequest;
import com.education.system.dto.LoginResponse;
import com.education.system.dto.RegisterRequest;
import com.education.system.entity.User;
import com.education.system.security.CustomUserDetailsService;
import com.education.system.service.UserService;
import com.education.system.util.JwtUtil;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            CustomUserDetailsService.CustomUserPrincipal customUser = (CustomUserDetailsService.CustomUserPrincipal) userDetails;
            User user = customUser.getUser();
            
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            
            LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getRole().name(),
                user.getFullName(),
                user.getEmail()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("=== 开始用户注册 ===");
            System.out.println("用户名: " + registerRequest.getUsername());
            System.out.println("邮箱: " + registerRequest.getEmail());
            System.out.println("角色: " + registerRequest.getRole());
            
            // 验证密码确认
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "密码和确认密码不匹配");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 验证角色
            User.UserRole role;
            try {
                role = User.UserRole.valueOf(registerRequest.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "无效的角色类型");
                return ResponseEntity.badRequest().body(error);
            }
            
            System.out.println("开始检查用户名和邮箱是否存在...");
            
            // 检查用户名是否已存在
            if (userService.findByUsername(registerRequest.getUsername()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "用户名已存在");
                return ResponseEntity.badRequest().body(error);
            }
            
            System.out.println("用户名检查通过，检查邮箱...");
            
            // 检查邮箱是否已存在
            if (userService.findByEmail(registerRequest.getEmail()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "邮箱已被注册");
                return ResponseEntity.badRequest().body(error);
            }
            
            System.out.println("邮箱检查通过，开始创建用户...");
            
            // 创建用户
            User user = userService.createUser(
                registerRequest.getUsername(),
                registerRequest.getPassword(),
                registerRequest.getEmail(),
                registerRequest.getFullName(),
                role
            );
            
            System.out.println("用户创建成功，ID: " + user.getId());
            
            // 生成token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            
            LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getRole().name(),
                user.getFullName(),
                user.getEmail()
            );
            
            System.out.println("=== 注册完成，返回响应 ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("注册失败: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "注册失败，请稍后重试");
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body("Not authenticated");
        }
        
        CustomUserDetailsService.CustomUserPrincipal customUser = 
            (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
        User user = customUser.getUser();
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("role", user.getRole().name());
        
        return ResponseEntity.ok(profile);
    }
}