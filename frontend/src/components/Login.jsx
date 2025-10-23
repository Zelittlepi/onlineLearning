import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
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
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError(''); // 清除错误信息
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (result.success) {
      // 登录成功，根据角色重定向
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>在线教育系统</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          请登录您的账户
        </p>
        
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="请输入用户名"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="请输入密码"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>测试账户：</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
            教师账户: teacher1 / password123
          </p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
            学生账户: student1 / password123
          </p>
        </div>

        <div className="register-link">
          还没有账户？ <Link to="/register">立即注册</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;