import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // 已登录，根据角色重定向
      if (user.role === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // 清除错误信息
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('密码和确认密码不匹配');
      return false;
    }
    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return false;
    }
    if (formData.username.length < 3) {
      setError('用户名长度至少3位');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
      // 注册成功，根据角色重定向
      if (result.user.role === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else if (result.user.role === 'STUDENT') {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>注册新账户</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          加入我们的在线教育平台
        </p>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">用户名 *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="请输入用户名"
              minLength="3"
              maxLength="20"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">姓名 *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="请输入真实姓名"
              maxLength="50"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">邮箱 *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="请输入邮箱地址"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">密码 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="请输入密码"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="请再次输入密码"
              minLength="6"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="role">角色 *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="role-select"
          >
            <option value="STUDENT">学生</option>
            <option value="TEACHER">教师</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="register-button"
          disabled={loading}
        >
          {loading ? '注册中...' : '立即注册'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="login-link">
          已有账户？ <Link to="/login">立即登录</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;