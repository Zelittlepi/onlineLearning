import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MyCourses from './MyCourses';
import MyAssignments from './MyAssignments';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState('home');

  const modules = [
    { 
      id: 'home', 
      name: '主页', 
      description: '学习概览',
      icon: '🏠'
    },
    { 
      id: 'courses', 
      name: '我的课程', 
      description: '查看和学习课程内容',
      icon: '📚',
      badge: '3'
    },
    { 
      id: 'assignments', 
      name: '作业任务', 
      description: '查看和提交作业',
      icon: '📝',
      badge: '2'
    },
    { 
      id: 'grades', 
      name: '成绩查询', 
      description: '查看考试和作业成绩',
      icon: '📊'
    },
    { 
      id: 'calendar', 
      name: '学习日程', 
      description: '查看课程安排和重要日期',
      icon: '📅'
    },
    { 
      id: 'discussions', 
      name: '讨论区', 
      description: '参与课程讨论和交流',
      icon: '💬'
    },
    { 
      id: 'ai', 
      name: 'AI学习助手', 
      description: '智能学习指导和答疑',
      icon: '🤖'
    },
    { 
      id: 'profile', 
      name: '个人中心', 
      description: '管理个人信息和设置',
      icon: '👤'
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const renderModuleContent = () => {
    switch(activeModule) {
      case 'home':
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>📚 学习概览</h2>
              <p>欢迎回来，{user?.fullName || user?.username}！查看您的学习进度和最新动态。</p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>3</h3>
                  <p>进行中的课程</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>2</h3>
                  <p>待完成作业</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>85%</h3>
                  <p>平均成绩</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>12</h3>
                  <p>获得徽章</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>📋 最近活动</h3>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <h4>高等数学作业3</h4>
                    <p>截止时间：2天后 | 状态：未提交</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-primary">开始作业</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🎥</div>
                  <div className="activity-content">
                    <h4>数据结构与算法 - 第8章</h4>
                    <p>新视频已发布 | 时长：45分钟</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">观看</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💬</div>
                  <div className="activity-content">
                    <h4>项目管理讨论区</h4>
                    <p>张教授回复了您的问题</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">查看</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="upcoming-events">
              <h3>📅 即将到来</h3>
              <div className="events-list">
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">14:00</span>
                    <span className="date">今天</span>
                  </div>
                  <div className="event-details">
                    <h4>数据结构直播课</h4>
                    <p>张教授 | 教室A101</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">10:00</span>
                    <span className="date">明天</span>
                  </div>
                  <div className="event-details">
                    <h4>计算机网络实验</h4>
                    <p>实验室B203</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return <MyCourses user={user} />;

      case 'assignments':
        return <MyAssignments user={user} />;

      case 'grades':
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>📊 成绩查询</h2>
              <p>查看您的考试和作业成绩</p>
            </div>

            <div className="grades-summary">
              <div className="grade-card">
                <h3>学期总成绩</h3>
                <div className="grade-value">85.2</div>
                <p>排名：15/120</p>
              </div>
              <div className="grade-card">
                <h3>GPA</h3>
                <div className="grade-value">3.7</div>
                <p>满分：4.0</p>
              </div>
              <div className="grade-card">
                <h3>学分</h3>
                <div className="grade-value">18/24</div>
                <p>已获得/总学分</p>
              </div>
            </div>

            <div className="grades-table">
              <h3>课程成绩详情</h3>
              <table>
                <thead>
                  <tr>
                    <th>课程名称</th>
                    <th>期中成绩</th>
                    <th>期末成绩</th>
                    <th>平时成绩</th>
                    <th>总成绩</th>
                    <th>学分</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>数据结构与算法</td>
                    <td>88</td>
                    <td>92</td>
                    <td>85</td>
                    <td>89</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>高等数学</td>
                    <td>75</td>
                    <td>-</td>
                    <td>82</td>
                    <td>78</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>大学英语</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>{modules.find(m => m.id === activeModule)?.icon} {modules.find(m => m.id === activeModule)?.name}</h2>
              <p>{modules.find(m => m.id === activeModule)?.description}</p>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">{modules.find(m => m.id === activeModule)?.icon}</div>
              <h3>功能开发中</h3>
              <p>此模块的详细功能正在开发中，敬请期待...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="blackboard-dashboard">
      {/* 顶部导航栏 */}
      <header className="top-header">
        <div className="header-left">
          <div className="logo">🎓</div>
          <h1>PolyU Learning Hub</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text" placeholder="搜索课程、作业..." />
            <span className="search-icon">🔍</span>
          </div>
          <div className="user-menu">
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-count">3</span>
            </div>
            <div className="user-profile">
              <img src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.username}&background=667eea&color=fff`} alt="User" />
              <span className="user-name">{user?.fullName || user?.username}</span>
              <button className="logout-button" onClick={handleLogout}>退出</button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* 左侧导航栏 */}
        <aside className="left-sidebar">
          <nav className="navigation-menu">
            {modules.map(module => (
              <div 
                key={module.id}
                className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
                onClick={() => setActiveModule(module.id)}
              >
                <span className="nav-icon">{module.icon}</span>
                <span className="nav-text">{module.name}</span>
                {module.badge && <span className="nav-badge">{module.badge}</span>}
              </div>
            ))}
          </nav>
        </aside>

        {/* 右侧主内容区域 */}
        <main className="main-content-area">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;