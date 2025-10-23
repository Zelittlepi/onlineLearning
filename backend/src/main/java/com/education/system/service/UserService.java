package com.education.system.service;

import com.education.system.entity.User;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    User save(User user);
    User createUser(String username, String password, String email, String fullName, User.UserRole role);
}