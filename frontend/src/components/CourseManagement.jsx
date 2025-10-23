import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseManagement = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);

  // 新课程表单数据
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
    level: 'BEGINNER',
    price: 0,
    maxStudents: 100,
    durationHours: 0
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('获取课程列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/teacher/courses', newCourse, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCourses([response.data.data, ...courses]);
        setShowCreateForm(false);
        setNewCourse({
          title: '',
          description: '',
          category: '',
          level: 'BEGINNER',
          price: 0,
          maxStudents: 100,
          durationHours: 0
        });
        alert('课程创建成功！');
      }
    } catch (error) {
      console.error('创建课程失败:', error);
      alert('创建课程失败，请重试');
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm('确定要删除这门课程吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8080/api/teacher/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCourses(courses.filter(course => course.id !== courseId));
        alert('课程删除成功！');
      }
    } catch (error) {
      console.error('删除课程失败:', error);
      alert('删除课程失败，请重试');
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'DRAFT': return '草稿';
      case 'PUBLISHED': return '已发布';
      case 'ARCHIVED': return '已归档';
      default: return status;
    }
  };

  const getLevelText = (level) => {
    switch(level) {
      case 'BEGINNER': return '初级';
      case 'INTERMEDIATE': return '中级';
      case 'ADVANCED': return '高级';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>加载课程中...</p>
      </div>
    );
  }

  return (
    <div className="course-management">
      <div className="content-header">
        <h2>📚 课程管理</h2>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            + 新建课程
          </button>
        </div>
      </div>

      {/* 创建课程表单 */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>创建新课程</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={createCourse}>
              <div className="form-group">
                <label>课程标题</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  required
                  placeholder="输入课程标题"
                />
              </div>
              
              <div className="form-group">
                <label>课程描述</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="输入课程描述"
                  rows="4"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>课程分类</label>
                  <input
                    type="text"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    placeholder="如：编程、数学、英语"
                  />
                </div>
                
                <div className="form-group">
                  <label>难度级别</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                  >
                    <option value="BEGINNER">初级</option>
                    <option value="INTERMEDIATE">中级</option>
                    <option value="ADVANCED">高级</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>课程价格</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({...newCourse, price: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label>最大学生数</label>
                  <input
                    type="number"
                    value={newCourse.maxStudents}
                    onChange={(e) => setNewCourse({...newCourse, maxStudents: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  创建课程
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 课程列表 */}
      <div className="courses-grid">
        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>还没有课程</h3>
            <p>点击"新建课程"开始创建您的第一门课程</p>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              创建课程
            </button>
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <div className="course-category">{course.category}</div>
                <div className={`course-status ${course.status.toLowerCase()}`}>
                  {getStatusText(course.status)}
                </div>
              </div>
              
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <span className="meta-label">级别:</span>
                    <span className="meta-value">{getLevelText(course.level)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">价格:</span>
                    <span className="meta-value">¥{course.price}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">最大学生:</span>
                    <span className="meta-value">{course.maxStudents}人</span>
                  </div>
                </div>
              </div>
              
              <div className="course-actions">
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowCourseDetail(true);
                  }}
                >
                  管理课程
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => deleteCourse(course.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseManagement;