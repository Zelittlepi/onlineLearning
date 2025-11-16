import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './StudentManagement.css';

const StudentManagement = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 筛选和搜索状态
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeTab, setActiveTab] = useState('all'); // all, active, inactive
  
  // 模态框状态
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchTeacherCourses();
    fetchAllStudents();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, selectedCourse, searchTerm, sortBy, sortOrder, activeTab]);

  const fetchTeacherCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('获取课程失败:', error);
      setError('获取课程列表失败');
    }
  };

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/teacher/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('获取学生失败:', error);
      setError('获取学生列表失败');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = [...students];

    // 课程筛选
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(student => 
        student.enrolledCourses?.some(course => course.id === parseInt(selectedCourse))
      );
    }

    // 状态筛选
    if (activeTab !== 'all') {
      filtered = filtered.filter(student => {
        if (activeTab === 'active') return student.status === 'ACTIVE';
        if (activeTab === 'inactive') return student.status !== 'ACTIVE';
        return true;
      });
    }

    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.fullName?.toLowerCase().includes(term) ||
        student.username?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.studentId?.toLowerCase().includes(term)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fullName || a.username || '';
          bValue = b.fullName || b.username || '';
          break;
        case 'studentId':
          aValue = a.studentId || '';
          bValue = b.studentId || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'enrollmentDate':
          aValue = new Date(a.enrollmentDate || 0);
          bValue = new Date(b.enrollmentDate || 0);
          break;
        case 'average':
          aValue = a.averageGrade || 0;
          bValue = b.averageGrade || 0;
          break;
        default:
          aValue = a.fullName || '';
          bValue = b.fullName || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStudents(filtered);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleGradeStudent = (student) => {
    setSelectedStudent(student);
    setShowGradeModal(true);
  };

  const handleMessageStudent = (student) => {
    setSelectedStudent(student);
    setShowMessageModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="status-badge active">活跃</span>;
      case 'INACTIVE':
        return <span className="status-badge inactive">非活跃</span>;
      case 'SUSPENDED':
        return <span className="status-badge suspended">暂停</span>;
      default:
        return <span className="status-badge unknown">未知</span>;
    }
  };

  const getPerformanceBadge = (average) => {
    if (average >= 90) return <span className="performance-badge excellent">优秀</span>;
    if (average >= 80) return <span className="performance-badge good">良好</span>;
    if (average >= 70) return <span className="performance-badge average">一般</span>;
    if (average >= 60) return <span className="performance-badge poor">及格</span>;
    return <span className="performance-badge fail">不及格</span>;
  };

  if (loading) {
    return (
      <div className="student-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载学生信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-management">
      <div className="content-header">
        <h2>👥 学生管理</h2>
        <p>管理您所有课程的学生信息和学习进度</p>
      </div>

      {/* 统计卡片 */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{students.length}</h3>
            <p>总学生数</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{students.filter(s => s.status === 'ACTIVE').length}</h3>
            <p>活跃学生</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{courses.length}</h3>
            <p>开设课程</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{students.length > 0 ? (students.reduce((sum, s) => sum + (s.averageGrade || 0), 0) / students.length).toFixed(1) : '0'}</h3>
            <p>平均成绩</p>
          </div>
        </div>
      </div>

      {/* 筛选和搜索工具栏 */}
      <div className="toolbar">
        <div className="toolbar-left">
          {/* 状态标签 */}
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              全部学生 ({students.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              活跃学生 ({students.filter(s => s.status === 'ACTIVE').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              非活跃 ({students.filter(s => s.status !== 'ACTIVE').length})
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          {/* 课程筛选 */}
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-filter"
          >
            <option value="all">所有课程</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          {/* 排序选择 */}
          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="sort-select"
          >
            <option value="name-asc">姓名 A-Z</option>
            <option value="name-desc">姓名 Z-A</option>
            <option value="studentId-asc">学号升序</option>
            <option value="studentId-desc">学号降序</option>
            <option value="average-desc">成绩高-低</option>
            <option value="average-asc">成绩低-高</option>
            <option value="enrollmentDate-desc">注册时间新-旧</option>
            <option value="enrollmentDate-asc">注册时间旧-新</option>
          </select>

          {/* 搜索框 */}
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索学生姓名、学号、邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {/* 学生列表 */}
      {error && <div className="error-message">{error}</div>}
      
      <div className="students-container">
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>暂无学生信息</h3>
            <p>当前筛选条件下没有找到学生</p>
          </div>
        ) : (
          <div className="students-table">
            <div className="table-header">
              <div className="col-avatar">头像</div>
              <div className="col-info">学生信息</div>
              <div className="col-courses">选课情况</div>
              <div className="col-performance">学习表现</div>
              <div className="col-status">状态</div>
              <div className="col-actions">操作</div>
            </div>
            
            <div className="table-body">
              {filteredStudents.map(student => (
                <div key={student.id} className="student-row">
                  <div className="col-avatar">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${student.fullName || student.username}&background=667eea&color=fff`}
                      alt={student.fullName || student.username}
                      className="student-avatar"
                    />
                  </div>
                  
                  <div className="col-info">
                    <div className="student-name">{student.fullName || student.username}</div>
                    <div className="student-details">
                      <span className="student-id">学号: {student.studentId || 'N/A'}</span>
                      <span className="student-email">{student.email}</span>
                    </div>
                  </div>
                  
                  <div className="col-courses">
                    <div className="course-count">
                      {student.enrolledCourses?.length || 0} 门课程
                    </div>
                    <div className="course-list">
                      {student.enrolledCourses?.slice(0, 2).map(course => (
                        <span key={course.id} className="course-tag">
                          {course.title}
                        </span>
                      ))}
                      {student.enrolledCourses?.length > 2 && (
                        <span className="course-more">+{student.enrolledCourses.length - 2}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-performance">
                    <div className="grade-display">
                      <span className="grade-number">{student.averageGrade || '--'}</span>
                      <span className="grade-max">/100</span>
                    </div>
                    {getPerformanceBadge(student.averageGrade || 0)}
                  </div>
                  
                  <div className="col-status">
                    {getStatusBadge(student.status)}
                    <div className="last-active">
                      {student.lastActive ? new Date(student.lastActive).toLocaleDateString() : '从未登录'}
                    </div>
                  </div>
                  
                  <div className="col-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => handleStudentClick(student)}
                      title="查看详情"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn warning"
                      onClick={() => handleGradeStudent(student)}
                      title="成绩管理"
                    >
                      📝
                    </button>
                    <button 
                      className="action-btn info"
                      onClick={() => handleMessageStudent(student)}
                      title="发送消息"
                    >
                      💬
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 学生详情模态框 */}
      {showDetailModal && selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* 成绩管理模态框 */}
      {showGradeModal && selectedStudent && (
        <GradeManagementModal 
          student={selectedStudent}
          onClose={() => setShowGradeModal(false)}
          onUpdate={fetchAllStudents}
        />
      )}

      {/* 消息模态框 */}
      {showMessageModal && selectedStudent && (
        <MessageModal 
          student={selectedStudent}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
};

// 学生详情模态框组件
const StudentDetailModal = ({ student, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>👤 学生详细信息</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="student-detail-grid">
            {/* 基本信息 */}
            <div className="detail-section">
              <h4>基本信息</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>姓名:</label>
                  <span>{student.fullName || student.username}</span>
                </div>
                <div className="info-item">
                  <label>学号:</label>
                  <span>{student.studentId || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>邮箱:</label>
                  <span>{student.email}</span>
                </div>
                <div className="info-item">
                  <label>注册时间:</label>
                  <span>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>最后登录:</label>
                  <span>{student.lastActive ? new Date(student.lastActive).toLocaleDateString() : '从未登录'}</span>
                </div>
              </div>
            </div>

            {/* 学习统计 */}
            <div className="detail-section">
              <h4>学习统计</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{student.enrolledCourses?.length || 0}</span>
                  <span className="stat-label">选修课程</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{student.completedActivities || 0}</span>
                  <span className="stat-label">完成作业</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{student.averageGrade || 0}%</span>
                  <span className="stat-label">平均成绩</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{student.totalStudyTime || 0}h</span>
                  <span className="stat-label">学习时长</span>
                </div>
              </div>
            </div>

            {/* 选课列表 */}
            <div className="detail-section full-width">
              <h4>选修课程</h4>
              <div className="courses-list">
                {student.enrolledCourses?.map(course => (
                  <div key={course.id} className="course-item">
                    <div className="course-info">
                      <h5>{course.title}</h5>
                      <p>注册时间: {new Date(course.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${course.progress || 0}%`}}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress || 0}%</span>
                    </div>
                    <div className="course-grade">
                      <span className="grade">{course.grade || '--'}</span>
                    </div>
                  </div>
                )) || <p>暂无选修课程</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 成绩管理模态框组件
const GradeManagementModal = ({ student, onClose, onUpdate }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentAssignments();
  }, [student.id]);

  const fetchStudentAssignments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/teacher/students/${student.id}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAssignments(response.data.data);
      }
    } catch (error) {
      console.error('获取学生作业失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📝 成绩管理 - {student.fullName || student.username}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>加载作业信息中...</p>
            </div>
          ) : (
            <div className="assignments-list">
              <h4>作业成绩列表</h4>
              {assignments.length === 0 ? (
                <p>该学生暂无作业记录</p>
              ) : (
                <div className="assignments-table">
                  {assignments.map(assignment => (
                    <div key={assignment.id} className="assignment-row">
                      <div className="assignment-info">
                        <h5>{assignment.title}</h5>
                        <p>{assignment.courseName}</p>
                      </div>
                      <div className="assignment-status">
                        <span className={`status ${assignment.status?.toLowerCase()}`}>
                          {assignment.status === 'Graded' ? '已评分' : 
                           assignment.status === 'Pending' ? '待评分' : 
                           assignment.status === 'Missing' ? '未提交' : '未开始'}
                        </span>
                      </div>
                      <div className="assignment-grade">
                        {assignment.score !== null ? (
                          <span className="grade">{assignment.score}/{assignment.maxPoints}</span>
                        ) : (
                          <span className="no-grade">--</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 消息模态框组件
const MessageModal = ({ student, onClose }) => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('请填写主题和消息内容');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/teacher/send-message', {
        studentId: student.id,
        subject: subject.trim(),
        message: message.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('消息发送成功！');
      onClose();
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('消息发送失败，请稍后再试');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💬 发送消息给 {student.fullName || student.username}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="message-form">
            <div className="form-group">
              <label>主题:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="请输入消息主题"
              />
            </div>
            
            <div className="form-group">
              <label>消息内容:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="请输入消息内容..."
                rows="6"
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="btn-cancel" 
                onClick={onClose}
                disabled={sending}
              >
                取消
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSendMessage}
                disabled={sending}
              >
                {sending ? '发送中...' : '发送消息'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;