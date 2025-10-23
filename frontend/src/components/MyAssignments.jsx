import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyAssignments = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [submissionModal, setSubmissionModal] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    content: '',
    attachmentUrl: ''
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/student/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAssignments(response.data.data);
      }
    } catch (error) {
      console.error('获取作业列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (assignmentId) => {
    if (!submissionData.content.trim()) {
      alert('请填写作业内容');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8080/api/student/assignments/${assignmentId}/submit`,
        submissionData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        alert('作业提交成功！');
        setSubmissionModal(null);
        setSubmissionData({ content: '', attachmentUrl: '' });
        fetchAssignments(); // 重新获取作业列表
      }
    } catch (error) {
      console.error('提交作业失败:', error);
      alert('提交失败，请重试');
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'HOMEWORK': return '作业';
      case 'QUIZ': return '测验';
      case 'PROJECT': return '项目';
      case 'EXAM': return '考试';
      default: return type;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'SUBMITTED': return '已提交';
      case 'GRADED': return '已评分';
      case 'RETURNED': return '已返回';
      default: return '未提交';
    }
  };

  const getStatusColor = (assignment) => {
    if (assignment.submission) {
      const status = assignment.submission.status;
      switch(status) {
        case 'SUBMITTED': return 'info';
        case 'GRADED': 
        case 'RETURNED': return 'success';
        default: return 'primary';
      }
    }
    
    // 未提交的作业根据截止时间判断
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (now > dueDate) {
      return 'danger'; // 已过期
    } else if ((dueDate - now) / (1000 * 60 * 60 * 24) <= 1) {
      return 'warning'; // 即将到期（1天内）
    } else {
      return 'primary'; // 正常
    }
  };

  const isOverdue = (assignment) => {
    if (assignment.submission) return false;
    return new Date() > new Date(assignment.dueDate);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const hasSubmission = !!assignment.submission;
    const isOverdueAssignment = isOverdue(assignment);
    
    switch(activeTab) {
      case 'pending':
        return !hasSubmission && !isOverdueAssignment;
      case 'submitted':
        return hasSubmission;
      case 'overdue':
        return !hasSubmission && isOverdueAssignment;
      default:
        return true;
    }
  });

  const openSubmissionModal = (assignment) => {
    setSubmissionModal(assignment);
    setSubmissionData({ content: '', attachmentUrl: '' });
  };

  const closeSubmissionModal = () => {
    setSubmissionModal(null);
    setSubmissionData({ content: '', attachmentUrl: '' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>加载作业中...</p>
      </div>
    );
  }

  return (
    <div className="my-assignments">
      <div className="content-header">
        <h2>📝 作业任务</h2>
        <p>查看和提交您的课程作业</p>
      </div>

      {/* 作业标签页 */}
      <div className="assignment-tabs">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          待提交 ({assignments.filter(a => !a.submission && !isOverdue(a)).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          已提交 ({assignments.filter(a => !!a.submission).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          已过期 ({assignments.filter(a => !a.submission && isOverdue(a)).length})
        </button>
      </div>

      {/* 作业列表 */}
      <div className="assignments-list">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>暂无作业</h3>
            <p>您目前没有{activeTab === 'pending' ? '待提交的' : activeTab === 'submitted' ? '已提交的' : '过期的'}作业</p>
          </div>
        ) : (
          filteredAssignments.map(assignment => (
            <div key={assignment.id} className={`assignment-card ${getStatusColor(assignment)}`}>
              <div className="assignment-header">
                <div className="assignment-info">
                  <h3>{assignment.title}</h3>
                  <div className="assignment-meta">
                    <span className="course-name">{assignment.courseName}</span>
                    <span className="assignment-type">{getTypeText(assignment.type)}</span>
                  </div>
                </div>
                <div className="assignment-status">
                  <span className={`status-badge ${getStatusColor(assignment)}`}>
                    {assignment.submission ? getStatusText(assignment.submission.status) : '未提交'}
                  </span>
                </div>
              </div>

              <div className="assignment-content">
                <p className="assignment-description">{assignment.description}</p>
                
                <div className="assignment-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>发布时间: {new Date(assignment.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span className={isOverdue(assignment) ? 'overdue-text' : ''}>
                      截止时间: {new Date(assignment.dueDate).toLocaleString()}
                      {isOverdue(assignment) && <span className="overdue-tag">已过期</span>}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🎯</span>
                    <span>总分: {assignment.totalScore}分</span>
                  </div>
                </div>

                {/* 提交信息 */}
                {assignment.submission && (
                  <div className="submission-info">
                    <h4>提交信息</h4>
                    <div className="submission-details">
                      <p><strong>提交时间:</strong> {new Date(assignment.submission.submissionDate).toLocaleString()}</p>
                      <p><strong>提交内容:</strong> {assignment.submission.content}</p>
                      {assignment.submission.attachmentUrl && (
                        <p><strong>附件:</strong> 
                          <a href={assignment.submission.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            查看附件
                          </a>
                        </p>
                      )}
                      {assignment.submission.score !== null && (
                        <p><strong>得分:</strong> 
                          <span className="score">{assignment.submission.score}/{assignment.totalScore}</span>
                        </p>
                      )}
                      {assignment.submission.feedback && (
                        <div className="feedback">
                          <p><strong>教师反馈:</strong></p>
                          <div className="feedback-content">{assignment.submission.feedback}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="assignment-actions">
                {!assignment.submission && !isOverdue(assignment) && (
                  <button 
                    className="btn-primary"
                    onClick={() => openSubmissionModal(assignment)}
                  >
                    提交作业
                  </button>
                )}
                {!assignment.submission && isOverdue(assignment) && (
                  <button className="btn-secondary" disabled>
                    已过期
                  </button>
                )}
                {assignment.submission && assignment.submission.status === 'SUBMITTED' && (
                  <button className="btn-secondary" disabled>
                    等待评分
                  </button>
                )}
                {assignment.submission && (assignment.submission.status === 'GRADED' || assignment.submission.status === 'RETURNED') && (
                  <button className="btn-primary">
                    查看详情
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 提交作业模态框 */}
      {submissionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>提交作业: {submissionModal.title}</h3>
              <button className="close-button" onClick={closeSubmissionModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>作业内容 *</label>
                <textarea
                  value={submissionData.content}
                  onChange={(e) => setSubmissionData({
                    ...submissionData,
                    content: e.target.value
                  })}
                  placeholder="请输入您的作业内容..."
                  rows="8"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>附件链接 (可选)</label>
                <input
                  type="url"
                  value={submissionData.attachmentUrl}
                  onChange={(e) => setSubmissionData({
                    ...submissionData,
                    attachmentUrl: e.target.value
                  })}
                  placeholder="请输入附件的URL链接..."
                />
              </div>
              
              <div className="submission-info-box">
                <p><strong>截止时间:</strong> {new Date(submissionModal.dueDate).toLocaleString()}</p>
                <p><strong>总分:</strong> {submissionModal.totalScore}分</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeSubmissionModal}>
                取消
              </button>
              <button 
                className="btn-primary"
                onClick={() => submitAssignment(submissionModal.id)}
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignments;