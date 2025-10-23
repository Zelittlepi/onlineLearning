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
    // Already logged in, redirect based on role
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
    setError(''); // Clear error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (result.success) {
      // Login successful, redirect based on role
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
        <h1>Online Education System</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          Please sign in to your account
        </p>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Test Accounts:</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
            Teacher: teacher1 / password123
          </p>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
            Student: student1 / password123
          </p>
        </div>

        <div className="register-link">
          Don't have an account? <Link to="/register">Sign up now</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;