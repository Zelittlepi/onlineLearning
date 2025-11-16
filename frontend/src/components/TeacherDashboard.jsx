import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CourseManagement from './CourseManagement';
import ActivityManagement from './ActivityManagement';
import StudentManagement from './StudentManagement';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState('home');

  const modules = [
    { 
      id: 'home', 
      name: 'Teacher Dashboard', 
      description: 'Teacher work overview',
      icon: '🏠'
    },
    { 
      id: 'courses', 
      name: 'Course Management', 
      description: 'Create and manage course content',
      icon: '📚',
      badge: '5'
    },
    { 
      id: 'activities', 
      name: 'Activity Management', 
      description: 'Create and manage course activities',
      icon: '🎯',
      badge: '12'
    },
    { 
      id: 'students', 
      name: 'Student Management', 
      description: 'View and manage student information',
      icon: '👥'
    },
    { 
      id: 'analytics', 
      name: 'Teaching Analytics', 
      description: 'View teaching data and student performance',
      icon: '📊'
    },
    { 
      id: 'calendar', 
      name: 'Teaching Schedule', 
      description: 'Manage course schedules and important events',
      icon: '📅'
    },
    { 
      id: 'ai', 
      name: 'AI Teaching Assistant', 
      description: 'Intelligent teaching assistance tools',
      icon: '🤖'
    },
    { 
      id: 'profile', 
      name: 'Profile Center', 
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
              <h2>👨‍🏫 Teacher Dashboard</h2>
              <p>Welcome back, {user?.fullName || user?.username}! Manage your courses and students.</p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>5</h3>
                  <p>Active Courses</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>186</h3>
                  <p>Total Students</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>23</h3>
                  <p>Pending Grading</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <h3>18</h3>
                  <p>Weekly Hours</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>📋 Recent Activities</h3>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-icon">🎯</div>
                  <div className="activity-content">
                    <h4>Data Structure Assignment Grading</h4>
                    <p>23 activities pending | Due: Tomorrow</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-primary">Start Grading</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <h4>Algorithm Design Course Update</h4>
                    <p>New chapter published | 15 students viewed</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">View Details</button>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💬</div>
                  <div className="activity-content">
                    <h4>Student Q&A</h4>
                    <p>5 new questions awaiting reply</p>
                  </div>
                  <div className="activity-action">
                    <button className="btn-secondary">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="upcoming-events">
              <h3>📅 Today's Class Schedule</h3>
              <div className="events-list">
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">14:00</span>
                    <span className="date">Today</span>
                  </div>
                  <div className="event-details">
                    <h4>Data Structures & Algorithms</h4>
                    <p>Classroom A101 | 45 students</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-time">
                    <span className="time">16:30</span>
                    <span className="date">Today</span>
                  </div>
                  <div className="event-details">
                    <h4>Office Hours Q&A</h4>
                    <p>Office | Appointments: 8 students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return <CourseManagement user={user} />;

      case 'activities':
        return <ActivityManagement user={user} />;

      case 'students':
        return <StudentManagement />;

      default:
        return (
          <div className="module-content-area">
            <div className="content-header">
              <h2>{modules.find(m => m.id === activeModule)?.icon} {modules.find(m => m.id === activeModule)?.name}</h2>
              <p>{modules.find(m => m.id === activeModule)?.description}</p>
            </div>
            <div className="placeholder-content">
              <div className="placeholder-icon">{modules.find(m => m.id === activeModule)?.icon}</div>
              <h3>Under Development</h3>
              <p>Detailed features for this module are under development, stay tuned...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="blackboard-dashboard">
      {/* Top navigation bar */}
      <header className="top-header">
        <div className="header-left">
          <div className="logo">👨‍🏫</div>
          <h1>PolyU Teaching Hub</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text" placeholder="Search courses, students..." />
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
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Left sidebar */}
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

        {/* Main content area */}
        <main className="main-content-area">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;