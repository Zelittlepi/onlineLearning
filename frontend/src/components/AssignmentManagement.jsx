import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentManagement = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // 新作业表单数据
  const [newAssignment, setNewAssignment] = useState({
    courseId: '',
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    maxScore: 100,
    submissionType: 'FILE'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssignments(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data.length > 0) {
        setCourses(response.data.data);
        setSelectedCourse(response.data.data[0].id);
      }
    } catch (error) {
      console.error('获取课程列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/teacher/courses/${courseId}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAssignments(response.data.data);
      }
    } catch (error) {
      console.error('获取作业列表失败:', error);
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const assignmentData = {
        ...newAssignment,
        courseId: selectedCourse,
        dueDate: new Date(newAssignment.dueDate).toISOString()
      };
      
      const response = await axios.post(
        `http://localhost:8080/api/teacher/courses/${selectedCourse}/assignments`, 
        assignmentData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setAssignments([response.data.data, ...assignments]);
        setShowCreateForm(false);
        setNewAssignment({
          courseId: '',
          title: '',
          description: '',
          instructions: '',
          dueDate: '',
          maxScore: 100,
          submissionType: 'FILE'
        });
        alert('作业创建成功！');
      }
    } catch (error) {
      console.error('创建作业失败:', error);
      alert('创建作业失败，请重试');
    }
  };

  const publishAssignment = async (assignmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8080/api/teacher/assignments/${assignmentId}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // 更新本地状态
        setAssignments(assignments.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, isPublished: true }
            : assignment
        ));
        alert('作业发布成功！');
      }
    } catch (error) {
      console.error('发布作业失败:', error);
      alert('发布作业失败，请重试');
    }
  };

  const getSubmissionTypeText = (type) => {
    switch(type) {
      case 'FILE': return '文件提交';
      case 'TEXT': return '文本提交';
      case 'URL': return '链接提交';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const filteredAssignments = assignments.filter(assignment => {
    switch(activeTab) {
      case 'published':
        return assignment.isPublished;
      case 'draft':
        return !assignment.isPublished;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>加载作业中...</p>
      </div>
    );
  }

  return (
    <div className="assignment-management">
      <div className="content-header">
        <h2>📝 作业管理</h2>
        <div className="header-actions">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-selector"
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button 
            className="btn-primary"
            onClick={() => setShowCreateForm(true)}
            disabled={!selectedCourse}
          >
            + 新建作业
          </button>
        </div>
      </div>

      {/* 作业标签页 */}
      <div className="assignment-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          全部 ({assignments.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          已发布 ({assignments.filter(a => a.isPublished).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          草稿 ({assignments.filter(a => !a.isPublished).length})
        </button>
      </div>

      {/* 创建作业表单 */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>创建新作业</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={createAssignment}>
              <div className="form-group">
                <label>作业标题</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  required
                  placeholder="输入作业标题"
                />
              </div>
              
              <div className="form-group">
                <label>作业描述</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="输入作业描述"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>作业说明</label>
                <textarea
                  value={newAssignment.instructions}
                  onChange={(e) => setNewAssignment({...newAssignment, instructions: e.target.value})}
                  placeholder="详细的作业要求和说明"
                  rows="5"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>截止时间</label>
                  <input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>总分</label>
                  <input
                    type="number"
                    value={newAssignment.maxScore}
                    onChange={(e) => setNewAssignment({...newAssignment, maxScore: parseFloat(e.target.value)})}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="form-group">
                  <label>提交方式</label>
                  <select
                    value={newAssignment.submissionType}
                    onChange={(e) => setNewAssignment({...newAssignment, submissionType: e.target.value})}
                  >
                    <option value="FILE">文件提交</option>
                    <option value="TEXT">文本提交</option>
                    <option value="URL">链接提交</option>
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  创建作业
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 作业列表 */}
      <div className="assignments-list">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>还没有作业</h3>
            <p>点击"新建作业"开始创建您的第一个作业</p>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateForm(true)}
              disabled={!selectedCourse}
            >
              创建作业
            </button>
          </div>
        ) : (
          filteredAssignments.map(assignment => (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <div className="assignment-title">
                  <h3>{assignment.title}</h3>
                  <div className={`assignment-status ${assignment.isPublished ? 'published' : 'draft'}`}>
                    {assignment.isPublished ? '已发布' : '草稿'}
                  </div>
                </div>
                <div className="assignment-score">
                  总分: {assignment.maxScore}分
                </div>
              </div>
              
              <div className="assignment-content">
                <p className="assignment-description">{assignment.description}</p>
                
                <div className="assignment-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>截止时间: {formatDate(assignment.dueDate)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📎</span>
                    <span>提交方式: {getSubmissionTypeText(assignment.submissionType)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span>创建时间: {formatDate(assignment.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="assignment-actions">
                {!assignment.isPublished && (
                  <button 
                    className="btn-primary"
                    onClick={() => publishAssignment(assignment.id)}
                  >
                    发布作业
                  </button>
                )}
                <button className="btn-secondary">
                  查看提交 (0)
                </button>
                <button className="btn-secondary">
                  编辑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;