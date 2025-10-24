import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../activities.css';

const MyActivities = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedType, setSelectedType] = useState('');
  const [submissionModal, setSubmissionModal] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    content: '',
    attachmentUrl: '',
    answers: {}
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/activities/student/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setActivities(response.data || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitActivity = async (activityId) => {
    if (submissionModal.activityType === 'QUIZ' && Object.keys(submissionData.answers).length === 0) {
      alert('Please answer at least one question');
      return;
    }

    if (submissionModal.activityType !== 'QUIZ' && !submissionData.content.trim()) {
      alert('Please fill in the activity content');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/submissions',
        {
          activityId: activityId,
          studentId: user.id,
          content: submissionData.content,
          attachmentUrl: submissionData.attachmentUrl,
          answers: submissionData.answers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Activity submitted successfully!');
      setSubmissionModal(null);
      setSubmissionData({ content: '', attachmentUrl: '', answers: {} });
      fetchActivities(); // Refresh activities list
    } catch (error) {
      console.error('Failed to submit activity:', error);
      alert(error.response?.data?.message || 'Submission failed, please try again');
    }
  };

  const getActivityTypeText = (type) => {
    switch(type) {
      case 'ASSIGNMENT': return 'Assignment';
      case 'QUIZ': return 'Quiz';
      case 'ANNOUNCEMENT': return 'Announcement';
      case 'PRACTICE': return 'Practice';
      default: return type;
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'ASSIGNMENT': return '📝';
      case 'QUIZ': return '🧪';
      case 'ANNOUNCEMENT': return '📢';
      case 'PRACTICE': return '🏃‍♂️';
      default: return '📋';
    }
  };

  const getStatusText = (submission) => {
    if (!submission) return 'Not Submitted';
    switch(submission.status) {
      case 'SUBMITTED': return 'Submitted';
      case 'GRADED': return 'Graded';
      case 'RETURNED': return 'Returned';
      default: return submission.status;
    }
  };

  const getStatusColor = (activity) => {
    if (activity.submission) {
      const status = activity.submission.status;
      switch(status) {
        case 'SUBMITTED': return 'info';
        case 'GRADED': return 'success';
        case 'RETURNED': return 'warning';
        default: return 'primary';
      }
    }
    
    // Check if activity is overdue
    if (activity.dueDate) {
      const now = new Date();
      const dueDate = new Date(activity.dueDate);
      
      if (now > dueDate) {
        return 'danger'; // Overdue
      } else if ((dueDate - now) / (1000 * 60 * 60 * 24) <= 1) {
        return 'warning'; // Due soon (within 1 day)
      }
    }
    
    return 'primary'; // Normal
  };

  const isOverdue = (activity) => {
    if (activity.submission || !activity.dueDate) return false;
    return new Date() > new Date(activity.dueDate);
  };

  const canSubmit = (activity) => {
    if (activity.activityType === 'ANNOUNCEMENT') return false;
    if (activity.submission) return false;
    if (isOverdue(activity)) return false;
    return true;
  };

  const filteredActivities = activities.filter(activity => {
    // Filter by type
    let typeMatch = true;
    if (selectedType) {
      typeMatch = activity.activityType === selectedType;
    }

    // Filter by status
    const hasSubmission = !!activity.submission;
    const isOverdueActivity = isOverdue(activity);
    
    switch(activeTab) {
      case 'pending':
        return !hasSubmission && !isOverdueActivity && typeMatch;
      case 'submitted':
        return hasSubmission && typeMatch;
      case 'overdue':
        return !hasSubmission && isOverdueActivity && typeMatch;
      default:
        return typeMatch;
    }
  });

  const openSubmissionModal = (activity) => {
    setSubmissionModal(activity);
    setSubmissionData({ content: '', attachmentUrl: '', answers: {} });
  };

  const closeSubmissionModal = () => {
    setSubmissionModal(null);
    setSubmissionData({ content: '', attachmentUrl: '', answers: {} });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="my-activities">
      <div className="content-header">
        <h2>🎯 My Activities</h2>
        <p>View and complete your course activities</p>
      </div>

      {/* Activity filter and tabs */}
      <div className="activity-filters">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="type-selector"
        >
          <option value="">All Types</option>
          <option value="ASSIGNMENT">Assignments</option>
          <option value="QUIZ">Quizzes</option>
          <option value="ANNOUNCEMENT">Announcements</option>
          <option value="PRACTICE">Practices</option>
        </select>
      </div>

      <div className="activity-tabs">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({activities.filter(a => !a.submission && !isOverdue(a)).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          Submitted ({activities.filter(a => !!a.submission).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          Overdue ({activities.filter(a => !a.submission && isOverdue(a)).length})
        </button>
      </div>

      {/* Activities list */}
      <div className="activities-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No activities</h3>
            <p>You currently have no {activeTab === 'pending' ? 'pending' : activeTab === 'submitted' ? 'submitted' : 'overdue'} activities</p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div key={activity.id} className={`activity-card ${getStatusColor(activity)}`}>
              <div className="activity-header">
                <div className="activity-info">
                  <div className="activity-title">
                    <span className="activity-icon">{getActivityIcon(activity.activityType)}</span>
                    <div>
                      <h3>{activity.title}</h3>
                      <div className="activity-meta">
                        <span className="course-name">{activity.courseName}</span>
                        <span className="activity-type">{getActivityTypeText(activity.activityType)}</span>
                        {activity.isRequired && <span className="required-badge">Required</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="activity-status">
                  <span className={`status-badge ${getStatusColor(activity)}`}>
                    {getStatusText(activity.submission)}
                  </span>
                </div>
              </div>

              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                
                <div className="activity-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>Available: {formatDate(activity.availableFrom)}</span>
                  </div>
                  {activity.dueDate && (
                    <div className="detail-item">
                      <span className="detail-icon">⏰</span>
                      <span className={isOverdue(activity) ? 'overdue-text' : ''}>
                        Due: {formatDate(activity.dueDate)}
                        {isOverdue(activity) && <span className="overdue-tag">Overdue</span>}
                      </span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-icon">🎯</span>
                    <span>Max Score: {activity.maxScore} points</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🔄</span>
                    <span>Attempts: {activity.attemptsAllowed === -1 ? 'Unlimited' : activity.attemptsAllowed}</span>
                  </div>
                  {activity.timeLimitMinutes && (
                    <div className="detail-item">
                      <span className="detail-icon">⏱️</span>
                      <span>Time Limit: {activity.timeLimitMinutes} minutes</span>
                    </div>
                  )}
                </div>

                {/* Submission information */}
                {activity.submission && (
                  <div className="submission-info">
                    <h4>Submission Information</h4>
                    <div className="submission-details">
                      <p><strong>Submitted:</strong> {formatDate(activity.submission.submittedAt)}</p>
                      <p><strong>Attempt:</strong> {activity.submission.attemptNumber}</p>
                      {activity.submission.content && (
                        <p><strong>Content:</strong> {activity.submission.content}</p>
                      )}
                      {activity.submission.attachmentUrl && (
                        <p><strong>Attachment:</strong> 
                          <a href={activity.submission.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            View Attachment
                          </a>
                        </p>
                      )}
                      {activity.submission.score !== null && activity.submission.score !== undefined && (
                        <p><strong>Score:</strong> 
                          <span className="score">{activity.submission.score}/{activity.maxScore}</span>
                        </p>
                      )}
                      {activity.submission.feedback && (
                        <div className="feedback">
                          <p><strong>Teacher Feedback:</strong></p>
                          <div className="feedback-content">{activity.submission.feedback}</div>
                        </div>
                      )}
                      {activity.submission.isLate && (
                        <p className="late-notice"><strong>Note:</strong> This submission was late</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="activity-actions">
                {canSubmit(activity) && (
                  <button 
                    className="btn-primary"
                    onClick={() => openSubmissionModal(activity)}
                  >
                    {activity.activityType === 'QUIZ' ? 'Start Quiz' : 'Submit Activity'}
                  </button>
                )}
                {!canSubmit(activity) && !activity.submission && isOverdue(activity) && (
                  <button className="btn-secondary" disabled>
                    Overdue
                  </button>
                )}
                {activity.submission && activity.submission.status === 'SUBMITTED' && (
                  <button className="btn-secondary" disabled>
                    Awaiting Grade
                  </button>
                )}
                {activity.submission && (activity.submission.status === 'GRADED' || activity.submission.status === 'RETURNED') && (
                  <button className="btn-primary">
                    View Details
                  </button>
                )}
                {activity.activityType === 'ANNOUNCEMENT' && (
                  <button className="btn-secondary">
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit activity modal */}
      {submissionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {submissionModal.activityType === 'QUIZ' ? 'Take Quiz' : 'Submit Activity'}: {submissionModal.title}
              </h3>
              <button className="close-button" onClick={closeSubmissionModal}>×</button>
            </div>
            
            <div className="modal-body">
              {submissionModal.activityType === 'QUIZ' ? (
                <div className="quiz-container">
                  <div className="quiz-instructions">
                    <p>{submissionModal.instructions}</p>
                    {submissionModal.timeLimitMinutes && (
                      <p className="time-warning">
                        ⏱️ Time Limit: {submissionModal.timeLimitMinutes} minutes
                      </p>
                    )}
                  </div>
                  
                  {/* Quiz questions would be rendered here */}
                  <div className="quiz-questions">
                    <p><em>Quiz questions will be loaded here...</em></p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Activity Content *</label>
                    <textarea
                      value={submissionData.content}
                      onChange={(e) => setSubmissionData({
                        ...submissionData,
                        content: e.target.value
                      })}
                      placeholder="Enter your activity content..."
                      rows="8"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Attachment Link (Optional)</label>
                    <input
                      type="url"
                      value={submissionData.attachmentUrl}
                      onChange={(e) => setSubmissionData({
                        ...submissionData,
                        attachmentUrl: e.target.value
                      })}
                      placeholder="Enter attachment URL link..."
                    />
                  </div>
                </>
              )}
              
              <div className="submission-info-box">
                {submissionModal.dueDate && (
                  <p><strong>Due Date:</strong> {formatDate(submissionModal.dueDate)}</p>
                )}
                <p><strong>Max Score:</strong> {submissionModal.maxScore} points</p>
                <p><strong>Attempts Allowed:</strong> {submissionModal.attemptsAllowed === -1 ? 'Unlimited' : submissionModal.attemptsAllowed}</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeSubmissionModal}>
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={() => submitActivity(submissionModal.id)}
              >
                {submissionModal.activityType === 'QUIZ' ? 'Submit Quiz' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyActivities;