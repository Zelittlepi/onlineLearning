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
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (assignmentId) => {
    if (!submissionData.content.trim()) {
      alert('Please fill in the assignment content');
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
        alert('Assignment submitted successfully!');
        setSubmissionModal(null);
        setSubmissionData({ content: '', attachmentUrl: '' });
        fetchAssignments(); // Refresh assignment list
      }
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Submission failed, please try again');
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case 'HOMEWORK': return 'Homework';
      case 'QUIZ': return 'Quiz';
      case 'PROJECT': return 'Project';
      case 'EXAM': return 'Exam';
      default: return type;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'SUBMITTED': return 'Submitted';
      case 'GRADED': return 'Graded';
      case 'RETURNED': return 'Returned';
      default: return 'Not Submitted';
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
    
    // Unsubmitted assignments judged by due date
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (now > dueDate) {
      return 'danger'; // Overdue
    } else if ((dueDate - now) / (1000 * 60 * 60 * 24) <= 1) {
      return 'warning'; // Due soon (within 1 day)
    } else {
      return 'primary'; // Normal
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
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="my-assignments">
      <div className="content-header">
        <h2>📝 My Assignments</h2>
        <p>View and submit your course assignments</p>
      </div>

      {/* Assignment tabs */}
      <div className="assignment-tabs">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({assignments.filter(a => !a.submission && !isOverdue(a)).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          Submitted ({assignments.filter(a => !!a.submission).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          Overdue ({assignments.filter(a => !a.submission && isOverdue(a)).length})
        </button>
      </div>

      {/* Assignment list */}
      <div className="assignments-list">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No assignments</h3>
            <p>You currently have no {activeTab === 'pending' ? 'pending' : activeTab === 'submitted' ? 'submitted' : 'overdue'} assignments</p>
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
                    {assignment.submission ? getStatusText(assignment.submission.status) : 'Not Submitted'}
                  </span>
                </div>
              </div>

              <div className="assignment-content">
                <p className="assignment-description">{assignment.description}</p>
                
                <div className="assignment-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>Published: {new Date(assignment.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span className={isOverdue(assignment) ? 'overdue-text' : ''}>
                      Due: {new Date(assignment.dueDate).toLocaleString()}
                      {isOverdue(assignment) && <span className="overdue-tag">Overdue</span>}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🎯</span>
                    <span>Total Score: {assignment.totalScore} points</span>
                  </div>
                </div>

                {/* Submission information */}
                {assignment.submission && (
                  <div className="submission-info">
                    <h4>Submission Information</h4>
                    <div className="submission-details">
                      <p><strong>Submitted:</strong> {new Date(assignment.submission.submissionDate).toLocaleString()}</p>
                      <p><strong>Content:</strong> {assignment.submission.content}</p>
                      {assignment.submission.attachmentUrl && (
                        <p><strong>Attachment:</strong> 
                          <a href={assignment.submission.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            View Attachment
                          </a>
                        </p>
                      )}
                      {assignment.submission.score !== null && (
                        <p><strong>Score:</strong> 
                          <span className="score">{assignment.submission.score}/{assignment.totalScore}</span>
                        </p>
                      )}
                      {assignment.submission.feedback && (
                        <div className="feedback">
                          <p><strong>Teacher Feedback:</strong></p>
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
                    Submit Assignment
                  </button>
                )}
                {!assignment.submission && isOverdue(assignment) && (
                  <button className="btn-secondary" disabled>
                    Overdue
                  </button>
                )}
                {assignment.submission && assignment.submission.status === 'SUBMITTED' && (
                  <button className="btn-secondary" disabled>
                    Awaiting Grade
                  </button>
                )}
                {assignment.submission && (assignment.submission.status === 'GRADED' || assignment.submission.status === 'RETURNED') && (
                  <button className="btn-primary">
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit assignment modal */}
      {submissionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Submit Assignment: {submissionModal.title}</h3>
              <button className="close-button" onClick={closeSubmissionModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Assignment Content *</label>
                <textarea
                  value={submissionData.content}
                  onChange={(e) => setSubmissionData({
                    ...submissionData,
                    content: e.target.value
                  })}
                  placeholder="Enter your assignment content..."
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
              
              <div className="submission-info-box">
                <p><strong>Due Date:</strong> {new Date(submissionModal.dueDate).toLocaleString()}</p>
                <p><strong>Total Score:</strong> {submissionModal.totalScore} points</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeSubmissionModal}>
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={() => submitAssignment(submissionModal.id)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignments;