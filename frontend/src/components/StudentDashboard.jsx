import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState('home');

  const modules = [
    { 
      id: 'home', 
      name: '主页', 
      description: '学生学习概览',
      icon: '🏠',
      color: '#667eea'
    },
    { 
      id: 'courses', 
      name: '我的课程', 
      description: '查看和学习课程内容',
      icon: '📚',
      color: '#f093fb',
      badge: '3门课程'
    },
    { 
      id: 'assignments', 
      name: '作业任务', 
      description: '查看和提交作业',
      icon: '📝',
      color: '#4facfe',
      badge: '2待完成'
    },
    { 
      id: 'grades', 
      name: '成绩查询', 
      description: '查看考试和作业成绩',
      icon: '📊',
      color: '#43e97b'
    },
    { 
      id: 'calendar', 
      name: '学习日程', 
      description: '查看课程安排和重要日期',
      icon: '📅',
      color: '#fa709a'
    },
    { 
      id: 'discussions', 
      name: '讨论区', 
      description: '参与课程讨论和交流',
      icon: '💬',
      color: '#ffecd2'
    },
    { 
      id: 'ai', 
      name: 'AI学习助手', 
      description: '智能学习指导和答疑',
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
    { type: '作业', title: '高等数学作业3', course: '高等数学', due: '2天后', status: 'pending' },
    { type: '测验', title: '英语听力测试', course: '大学英语', due: '明天', status: 'urgent' },
    { type: '讨论', title: '项目管理案例分析', course: '项目管理', due: '已完成', status: 'completed' }
  ];

  const upcomingEvents = [
    { type: '直播课', title: '数据结构与算法', time: '今天 14:00', instructor: '张教授' },
    { type: '实验课', title: '计算机网络实验', time: '明天 10:00', location: '实验室A' },
    { type: '讲座', title: '人工智能前沿技术', time: '周五 15:30', speaker: '李博士' }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'urgent': return '#e74c3c';
      case 'pending': return '#f39c12';
      case 'completed': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="modern-dashboard">
      {/* 顶部导航栏 */}
      <header className="top-navbar">
        <div className="navbar-brand">
          <div className="logo">🎓</div>
          <h1>PolyU Learning Hub</h1>
        </div>
        <div className="navbar-actions">
          <div className="search-box">
            <input type="text" placeholder="搜索课程、作业..." />
            <span className="search-icon">🔍</span>
          </div>
          <div className="user-menu">
            <div className="notification-bell">
              🔔
              <span className="notification-badge">3</span>
            </div>
            <div className="user-avatar">
              <img src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.username}&background=667eea&color=fff`} alt="User Avatar" />
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{user?.fullName || user?.username}</strong>
                  <span>{user?.email}</span>
                  <small>学生 | {user?.role}</small>
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
              <div className="welcome-banner">
                <div className="welcome-content">
                  <h2>欢迎回来，{user?.fullName || user?.username}！</h2>
                  <p>继续您的学习之旅，今天有 <strong>2项作业</strong> 待完成，<strong>1场直播课</strong> 即将开始。</p>
                </div>
                <div className="welcome-illustration">
                  📖
                </div>
              </div>

              {/* 快速访问卡片 */}
              <div className="quick-access">
                <h3>快速访问</h3>
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

              {/* 最近活动和即将到来的事件 */}
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
                          <span className="activity-due">{activity.due}</span>
                        </div>
                        <div className="activity-status">
                          <span className={`status-indicator ${activity.status}`}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="upcoming-events">
                  <h3>即将到来</h3>
                  <div className="event-list">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="event-item">
                        <div className="event-time">
                          <span className="time">{event.time.split(' ')[1]}</span>
                          <span className="date">{event.time.split(' ')[0]}</span>
                        </div>
                        <div className="event-details">
                          <div className="event-type">{event.type}</div>
                          <h4>{event.title}</h4>
                          <p>{event.instructor || event.location || event.speaker}</p>
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

export default StudentDashboard;