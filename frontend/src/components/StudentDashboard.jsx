import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MyCourses from './MyCourses';
import MyActivities from './MyActivities';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState('home');

  const modules = [
    { 
      id: 'home', 
      name: 'Home', 
      description: 'Learning Overview',
      icon: '🏠'
    },
    { 
      id: 'courses', 
      name: 'My Courses', 
      description: 'View and learn course content',
      icon: '📚',
      badge: '3'
    },
    { 
      id: 'activities', 
      name: 'Activities', 
      description: 'View and complete course activities',
      icon: '🎯',
      badge: '2'
    },
    { 
      id: 'grades', 
      name: 'Grades', 
      description: 'View exam and assignment grades',
      icon: '📊'
    },
    { 
      id: 'calendar', 
      name: 'Schedule', 
      description: 'View course schedule and important dates',
      icon: '📅'
    },
    { 
      id: 'discussions', 
      name: 'Discussions', 
      description: 'Participate in course discussions',
      icon: '💬'
    },
    { 
      id: 'ai', 
      name: 'AI Assistant', 
      description: 'Intelligent learning guidance and Q&A',
      icon: '🤖'
    },
    { 
      id: 'profile', 
      name: 'Profile', 
      description: 'Manage personal information and settings',
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
              <h2>📚 Learning Overview</h2>
              <p>Welcome back, {user?.fullName || user?.username}! Check your learning progress and latest updates.</p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>3</h3>
                  <p>Active Courses</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>2</h3>
                  <p>Pending Activities</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>85%</h3>
                  <p>Average Grade</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>12</h3>
                  <p>Badges Earned</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>📋 Recent Activities</h3>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">🎯</div>
                  <div className="activity-content">
                    <h4>Advanced Mathematics Assignment 3</h4>
                    <p>Due: 2 days | Status: Not submitted</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-primary">Start Activity</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🎥</div>
                  <div className="activity-content">
                    <h4>Data Structures & Algorithms - Chapter 8</h4>
                    <p>New video published | Duration: 45 minutes</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">Watch</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💬</div>
                  <div className="activity-content">
                    <h4>Project Management Discussion</h4>
                    <p>Prof. Zhang replied to your question</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">View</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="upcoming-events">
              <h3>📅 Upcoming Events</h3>
              <div className="events-list">
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">14:00</span>
                    <span className="date">Today</span>
                  </div>
                  <div className="event-details">
                    <h4>Data Structures Live Class</h4>
                    <p>Prof. Zhang | Room A101</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">10:00</span>
                    <span className="date">Tomorrow</span>
                  </div>
                  <div className="event-details">
                    <h4>Computer Networks Lab</h4>
                    <p>Lab B203</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return <MyCourses user={user} />;

      case 'activities':
        return <MyActivities user={user} />;

      case 'grades':
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>📊 Grades</h2>
              <p>View your exam and assignment grades</p>
            </div>

            <div className="grades-summary">
              <div className="grade-card">
                <h3>Semester Grade</h3>
                <div className="grade-value">85.2</div>
                <p>Rank: 15/120</p>
              </div>
              <div className="grade-card">
                <h3>GPA</h3>
                <div className="grade-value">3.7</div>
                <p>Out of: 4.0</p>
              </div>
              <div className="grade-card">
                <h3>Credits</h3>
                <div className="grade-value">18/24</div>
                <p>Earned/Total</p>
              </div>
            </div>

            <div className="grades-table">
              <h3>Course Grade Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Midterm</th>
                    <th>Final</th>
                    <th>Coursework</th>
                    <th>Overall</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data Structures & Algorithms</td>
                    <td>88</td>
                    <td>92</td>
                    <td>85</td>
                    <td>89</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>Advanced Mathematics</td>
                    <td>75</td>
                    <td>-</td>
                    <td>82</td>
                    <td>78</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>College English</td>
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
              <h3>Feature Under Development</h3>
              <p>This module is currently under development. Stay tuned...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="blackboard-dashboard">
      {/* Top Navigation Bar */}
      <header className="top-header">
        <div className="header-left">
          <div className="logo">🎓</div>
          <h1>PolyU Learning Hub</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text" placeholder="Search courses, assignments..." />
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
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Left Sidebar */}
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

        {/* Main Content Area */}
        <main className="main-content-area">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;