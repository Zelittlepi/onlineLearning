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
      icon: '🏠'
    },
    { 
      id: 'courses', 
      name: '课程管理', 
      description: '创建和管理课程内容',
      icon: '📚',
      badge: '5'
    },
    { 
      id: 'assignments', 
      name: '作业管理', 
      description: '发布和批改作业',
      icon: '📝',
      badge: '12'
    },
    { 
      id: 'students', 
      name: '学生管理', 
      description: '查看和管理学生信息',
      icon: '👥'
    },
    { 
      id: 'analytics', 
      name: '教学分析', 
      description: '查看教学数据和学生表现',
      icon: '📊'
    },
    { 
      id: 'calendar', 
      name: '教学日程', 
      description: '管理课程安排和重要事件',
      icon: '📅'
    },
    { 
      id: 'ai', 
      name: 'AI教学助手', 
      description: '智能教学辅助工具',
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
              <h2>👨‍🏫 教师工作台</h2>
              <p>欢迎回来，{user?.fullName || user?.username} 老师！管理您的课程和学生。</p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>5</h3>
                  <p>活跃课程</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>186</h3>
                  <p>学生总数</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>23</h3>
                  <p>待批改作业</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <h3>18</h3>
                  <p>本周课时</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>📋 最近活动</h3>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <h4>数据结构作业批改</h4>
                    <p>23份作业待批改 | 截止时间：明天</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-primary">开始批改</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <h4>算法设计课程更新</h4>
                    <p>新章节已发布 | 15个学生已查看</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">查看详情</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💬</div>
                  <div className="activity-content">
                    <h4>学生问题答疑</h4>
                    <p>5个新问题等待回复</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">去回复</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="upcoming-events">
              <h3>📅 今日课程安排</h3>
              <div className="events-list">
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">14:00</span>
                    <span className="date">今天</span>
                  </div>
                  <div className="event-details">
                    <h4>数据结构与算法</h4>
                    <p>教室A101 | 45名学生</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">16:30</span>
                    <span className="date">今天</span>
                  </div>
                  <div className="event-details">
                    <h4>办公时间答疑</h4>
                    <p>办公室 | 预约学生：8人</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>📚 课程管理</h2>
              <p>创建、编辑和管理您的所有课程</p>
            </div>
            
            <div className="courses-grid">
              <div className="course-card">
                <div className="course-header">
                  <div className="course-icon">💻</div>
                  <div className="course-status">进行中</div>
                </div>
                <h3>数据结构与算法</h3>
                <p>计算机科学系 | 45名学生</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '75%'}}></div>
                  </div>
                  <span>课程进度：75%</span>
                </div>
                <div className="course-actions">
                  <button className="btn-primary">管理课程</button>
                  <button className="btn-secondary">查看详情</button>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <div className="course-icon">🔧</div>
                  <div className="course-status">进行中</div>
                </div>
                <h3>软件工程基础</h3>
                <p>计算机科学系 | 38名学生</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '60%'}}></div>
                  </div>
                  <span>课程进度：60%</span>
                </div>
                <div className="course-actions">
                  <button className="btn-primary">管理课程</button>
                  <button className="btn-secondary">查看详情</button>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <div className="course-icon">🤖</div>
                  <div className="course-status">即将开始</div>
                </div>
                <h3>人工智能导论</h3>
                <p>计算机科学系 | 52名学生</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '0%'}}></div>
                  </div>
                  <span>准备中</span>
                </div>
                <div className="course-actions">
                  <button className="btn-disabled" disabled>准备中</button>
                  <button className="btn-secondary">编辑课程</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>📝 作业管理</h2>
              <p>发布新作业和批改学生提交的作业</p>
            </div>
            
            <div className="assignments-tabs">
              <button className="tab-button active">待批改 (23)</button>
              <button className="tab-button">已发布 (12)</button>
              <button className="tab-button">草稿 (3)</button>
            </div>

            <div className="assignments-list">
              <div className="assignment-item urgent">
                <div className="assignment-header">
                  <div className="assignment-course">数据结构</div>
                  <div className="assignment-due">截止：明天</div>
                </div>
                <h3>二叉树实现 - 编程作业</h3>
                <p>学生需要实现二叉搜索树的基本操作。已提交：23份，待批改：23份</p>
                <div className="assignment-meta">
                  <span>📅 发布时间：2024年10月20日</span>
                  <span>📊 总分：150分</span>
                  <span>👥 参与学生：45人</span>
                </div>
                <div className="assignment-actions">
                  <button className="btn-primary">开始批改</button>
                  <button className="btn-secondary">查看详情</button>
                </div>
              </div>

              <div className="assignment-item">
                <div className="assignment-header">
                  <div className="assignment-course">软件工程</div>
                  <div className="assignment-due">进行中</div>
                </div>
                <h3>项目需求分析报告</h3>
                <p>分组完成软件需求分析文档。已提交：15份，待批改：15份</p>
                <div className="assignment-meta">
                  <span>📅 发布时间：2024年10月18日</span>
                  <span>📊 总分：100分</span>
                  <span>👥 参与学生：38人</span>
                </div>
                <div className="assignment-actions">
                  <button className="btn-primary">继续批改</button>
                  <button className="btn-secondary">查看详情</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>👥 学生管理</h2>
              <p>查看和管理您课程中的学生信息</p>
            </div>

            <div className="grades-table">
              <h3>学生列表</h3>
              <table>
                <thead>
                  <tr>
                    <th>学号</th>
                    <th>姓名</th>
                    <th>课程</th>
                    <th>平均成绩</th>
                    <th>出勤率</th>
                    <th>最后活跃</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2021001</td>
                    <td>张三</td>
                    <td>数据结构</td>
                    <td>89</td>
                    <td>95%</td>
                    <td>2小时前</td>
                    <td>
                      <button className="btn-secondary">查看详情</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2021002</td>
                    <td>李四</td>
                    <td>软件工程</td>
                    <td>92</td>
                    <td>88%</td>
                    <td>1天前</td>
                    <td>
                      <button className="btn-secondary">查看详情</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2021003</td>
                    <td>王五</td>
                    <td>数据结构</td>
                    <td>78</td>
                    <td>92%</td>
                    <td>3小时前</td>
                    <td>
                      <button className="btn-secondary">查看详情</button>
                    </td>
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
          <div className="logo">👨‍🏫</div>
          <h1>PolyU Teaching Hub</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text" placeholder="搜索课程、学生..." />
            <span className="search-icon">🔍</span>
          </div>
          <div className="user-menu">
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-count">5</span>
            </div>
            <div className="user-profile">
              <img src={`https://ui-avatars.com/api/?name=${user?.fullName || user?.username}&background=764ba2&color=fff`} alt="User" />
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

export default TeacherDashboard;