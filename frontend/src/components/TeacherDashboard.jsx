import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState('home');

  const modules = [
    { 
      id: 'home', 
      name: '教师工作台', 
      description: '教师工作概览',
      icon: '🏠',
      color: '#667eea'
    },
    { 
      id: 'courses', 
      name: '课程管理', 
      description: '创建和管理课程内容',
      icon: '📚',
      color: '#f093fb',
      badge: '5门课程'
    },
    { 
      id: 'assignments', 
      name: '作业管理', 
      description: '发布和批改作业',
      icon: '📝',
      color: '#4facfe',
      badge: '12待批改'
    },
    { 
      id: 'students', 
      name: '学生管理', 
      description: '查看和管理学生信息',
      icon: '👥',
      color: '#43e97b'
    },
    { 
      id: 'analytics', 
      name: '教学分析', 
      description: '查看教学数据和学生表现',
      icon: '📊',
      color: '#fa709a'
    },
    { 
      id: 'calendar', 
      name: '教学日程', 
      description: '管理课程安排和重要事件',
      icon: '📅',
      color: '#ffecd2'
    },
    { 
      id: 'ai', 
      name: 'AI教学助手', 
      description: '智能教学辅助工具',
      icon: '🤖',
      color: '#a8edea'
    },
    { 
      id: 'profile', 
      name: '个人中心', 
      description: '管理个人信息和设置',
      icon: '👤',
      color: '#d299c2'
    }
  ];

  const recentActivities = [
    { type: '作业', title: '数据结构作业批改', course: '数据结构', count: '23份', status: 'pending' },
    { type: '课程', title: '算法设计课程更新', course: '算法设计', action: '已发布', status: 'completed' },
    { type: '讨论', title: '项目答疑', course: '软件工程', participants: '15人', status: 'active' }
  ];

  const upcomingClasses = [
    { course: '数据结构与算法', time: '今天 14:00-16:00', room: '教室A101', students: 45 },
    { course: '软件工程基础', time: '明天 10:00-12:00', room: '教室B203', students: 38 },
    { course: '人工智能导论', time: '周三 15:30-17:30', room: '实验室C301', students: 52 }
  ];

  const quickStats = [
    { label: '总课程数', value: '5', trend: '+1', color: '#667eea' },
    { label: '活跃学生', value: '186', trend: '+12', color: '#43e97b' },
    { label: '待批改作业', value: '23', trend: '-5', color: '#f39c12' },
    { label: '本周课时', value: '18', trend: '+2', color: '#e74c3c' }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'completed': return '#3498db';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="modern-dashboard">
      {/* 顶部导航栏 */}
      <header className="top-navbar">
        <div className="navbar-brand">
          <div className="logo">👨‍🏫</div>
          <h1>PolyU Teaching Hub</h1>
        </div>
        <div className="navbar-actions">
          <div className="search-box">
            <input type="text" placeholder="搜索课程、学生..." />
            <span className="search-icon">🔍</span>
          </div>
          <div className="user-menu">
            <div className="notification-bell">
              🔔
              <span className="notification-badge">5</span>
            </div>
            <div className="user-avatar">
              <img src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.username}&background=764ba2&color=fff`} alt="User Avatar" />
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{user?.fullName || user?.username}</strong>
                  <span>{user?.email}</span>
                  <small>教师 | {user?.role}</small>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 退出登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* 左侧导航栏 */}
        <aside className="sidebar-nav">
          <nav className="nav-menu">
            {modules.map(module => (
              <div 
                key={module.id}
                className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
                onClick={() => setActiveModule(module.id)}
              >
                <span className="nav-icon">{module.icon}</span>
                <span className="nav-label">{module.name}</span>
                {module.badge && <span className="nav-badge">{module.badge}</span>}
              </div>
            ))}
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="main-content">
          {activeModule === 'home' && (
            <div className="home-dashboard">
              {/* 欢迎卡片 */}
              <div className="welcome-banner teacher-banner">
                <div className="welcome-content">
                  <h2>欢迎回来，{user?.fullName || user?.username} 老师！</h2>
                  <p>今天您有 <strong>3门课程</strong> 要上，<strong>23份作业</strong> 待批改，<strong>5个学生</strong> 等待答疑。</p>
                </div>
                <div className="welcome-illustration">
                  📚
                </div>
              </div>

              {/* 快速统计 */}
              <div className="quick-stats">
                <h3>快速统计</h3>
                <div className="stats-grid">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ '--stat-color': stat.color }}>
                      <div className="stat-value">
                        {stat.value}
                        <span className="stat-trend">{stat.trend}</span>
                      </div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 快速访问 */}
              <div className="quick-access">
                <h3>教学工具</h3>
                <div className="modules-grid">
                  {modules.slice(1).map(module => (
                    <div 
                      key={module.id}
                      className="module-card modern-card"
                      onClick={() => setActiveModule(module.id)}
                      style={{ '--card-color': module.color }}
                    >
                      <div className="card-icon">{module.icon}</div>
                      <h4>{module.name}</h4>
                      <p>{module.description}</p>
                      {module.badge && <span className="card-badge">{module.badge}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 教学活动和即将上课 */}
              <div className="activity-section">
                <div className="recent-activities">
                  <h3>最近活动</h3>
                  <div className="activity-list">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-type" style={{ backgroundColor: getStatusColor(activity.status) }}>
                          {activity.type}
                        </div>
                        <div className="activity-details">
                          <h4>{activity.title}</h4>
                          <p>{activity.course}</p>
                          <span className="activity-due">
                            {activity.count || activity.action || activity.participants}
                          </span>
                        </div>
                        <div className="activity-status">
                          <span className={`status-indicator ${activity.status}`}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="upcoming-events">
                  <h3>即将上课</h3>
                  <div className="event-list">
                    {upcomingClasses.map((classItem, index) => (
                      <div key={index} className="event-item class-item">
                        <div className="event-time">
                          <span className="time">{classItem.time.split(' ')[1]}</span>
                          <span className="date">{classItem.time.split(' ')[0]}</span>
                        </div>
                        <div className="event-details">
                          <div className="event-type">课程</div>
                          <h4>{classItem.course}</h4>
                          <p>{classItem.room} · {classItem.students}名学生</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 其他模块的内容 */}
          {activeModule !== 'home' && (
            <div className="module-content">
              <div className="module-header">
                <div className="module-title">
                  <span className="module-icon">{modules.find(m => m.id === activeModule)?.icon}</span>
                  <h2>{modules.find(m => m.id === activeModule)?.name}</h2>
                </div>
                <div className="module-actions">
                  <button className="action-btn">刷新</button>
                  <button className="action-btn primary">新建</button>
                </div>
              </div>
              
              <div className="module-body">
                <div className="content-placeholder">
                  <div className="placeholder-icon">{modules.find(m => m.id === activeModule)?.icon}</div>
                  <h3>{modules.find(m => m.id === activeModule)?.name}</h3>
                  <p>{modules.find(m => m.id === activeModule)?.description}</p>
                  <p className="placeholder-text">此模块的详细功能正在开发中，敬请期待...</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;