package com.education.system.dto;

public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String role;
    private String fullName;
    private String email;
    
    public LoginResponse() {}
    
    public LoginResponse(String token, String username, String role, String fullName, String email) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}