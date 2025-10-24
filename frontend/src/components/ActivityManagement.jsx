import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../activities.css';

const ActivityManagement = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedActivityType, setSelectedActivityType] = useState('ASSIGNMENT');

  // New activity form data
  const [newActivity, setNewActivity] = useState({
    courseId: '',
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    maxScore: 100,
    submissionType: 'FILE',
    activityType: 'ASSIGNMENT',
    isRequired: true,
    attemptsAllowed: 1,
    timeLimitMinutes: null,
    gradingMethod: 'MANUAL',
    configuration: {}
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchActivities(selectedCourse);
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
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/activities/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setActivities(response.data || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const createActivity = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const activityData = {
        ...newActivity,
        courseId: selectedCourse,
        teacherId: user.id,
        dueDate: newActivity.dueDate ? new Date(newActivity.dueDate).toISOString() : null
      };
      
      const response = await axios.post(
        'http://localhost:8080/api/activities', 
        activityData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setActivities([response.data, ...activities]);
      setShowCreateForm(false);
      resetForm();
      alert('Activity created successfully!');
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to create activity, please try again');
    }
  };

  const publishActivity = async (activityId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/activities/${activityId}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setActivities(activities.map(activity => 
        activity.id === activityId 
          ? { ...activity, isPublished: true }
          : activity
      ));
      alert('Activity published successfully!');
    } catch (error) {
      console.error('Failed to publish activity:', error);
      alert('Failed to publish activity, please try again');
    }
  };

  const deleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setActivities(activities.filter(activity => activity.id !== activityId));
      alert('Activity deleted successfully!');
    } catch (error) {
      console.error('Failed to delete activity:', error);
      alert('Failed to delete activity, please try again');
    }
  };

  const resetForm = () => {
    setNewActivity({
      courseId: '',
      title: '',
      description: '',
      instructions: '',
      dueDate: '',
      maxScore: 100,
      submissionType: 'FILE',
      activityType: 'ASSIGNMENT',
      isRequired: true,
      attemptsAllowed: 1,
      timeLimitMinutes: null,
      gradingMethod: 'MANUAL',
      configuration: {}
    });
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

  const getSubmissionTypeText = (type) => {
    switch(type) {
      case 'FILE': return 'File Upload';
      case 'TEXT': return 'Text Entry';
      case 'MULTIPLE_CHOICE': return 'Multiple Choice';
      case 'URL': return 'URL Link';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US');
  };

  const filteredActivities = activities.filter(activity => {
    let typeMatch = true;
    if (selectedActivityType && selectedActivityType !== 'ALL') {
      typeMatch = activity.activityType === selectedActivityType;
    }

    switch(activeTab) {
      case 'published':
        return activity.isPublished && typeMatch;
      case 'draft':
        return !activity.isPublished && typeMatch;
      default:
        return typeMatch;
    }
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="activity-management">
      <div className="content-header">
        <h2>🎯 Activity Management</h2>
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
          <select
            value={selectedActivityType}
            onChange={(e) => setSelectedActivityType(e.target.value)}
            className="type-selector"
          >
            <option value="">All Types</option>
            <option value="ASSIGNMENT">Assignments</option>
            <option value="QUIZ">Quizzes</option>
            <option value="ANNOUNCEMENT">Announcements</option>
            <option value="PRACTICE">Practices</option>
          </select>
          <button 
            className="btn-primary"
            onClick={() => setShowCreateForm(true)}
            disabled={!selectedCourse}
          >
            + New Activity
          </button>
        </div>
      </div>

      {/* Activity tabs */}
      <div className="activity-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({filteredActivities.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          Published ({activities.filter(a => a.isPublished).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          Draft ({activities.filter(a => !a.isPublished).length})
        </button>
      </div>

      {/* Create activity form */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Create New Activity</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={createActivity}>
              <div className="form-row">
                <div className="form-group">
                  <label>Activity Type</label>
                  <select
                    value={newActivity.activityType}
                    onChange={(e) => setNewActivity({...newActivity, activityType: e.target.value})}
                    required
                  >
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="PRACTICE">Practice</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Submission Type</label>
                  <select
                    value={newActivity.submissionType}
                    onChange={(e) => setNewActivity({...newActivity, submissionType: e.target.value})}
                  >
                    <option value="FILE">File Upload</option>
                    <option value="TEXT">Text Entry</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="URL">URL Link</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Activity Title</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  required
                  placeholder="Enter activity title"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  placeholder="Enter activity description"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  value={newActivity.instructions}
                  onChange={(e) => setNewActivity({...newActivity, instructions: e.target.value})}
                  placeholder="Detailed requirements and instructions"
                  rows="5"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="datetime-local"
                    value={newActivity.dueDate}
                    onChange={(e) => setNewActivity({...newActivity, dueDate: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Max Score</label>
                  <input
                    type="number"
                    value={newActivity.maxScore}
                    onChange={(e) => setNewActivity({...newActivity, maxScore: parseFloat(e.target.value)})}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="form-group">
                  <label>Attempts Allowed</label>
                  <input
                    type="number"
                    value={newActivity.attemptsAllowed}
                    onChange={(e) => setNewActivity({...newActivity, attemptsAllowed: parseInt(e.target.value)})}
                    min="-1"
                    placeholder="-1 for unlimited"
                  />
                </div>
              </div>

              {newActivity.activityType === 'QUIZ' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Time Limit (minutes)</label>
                    <input
                      type="number"
                      value={newActivity.timeLimitMinutes || ''}
                      onChange={(e) => setNewActivity({...newActivity, timeLimitMinutes: parseInt(e.target.value) || null})}
                      min="1"
                      placeholder="Optional time limit"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Grading Method</label>
                    <select
                      value={newActivity.gradingMethod}
                      onChange={(e) => setNewActivity({...newActivity, gradingMethod: e.target.value})}
                    >
                      <option value="AUTO">Auto Grade</option>
                      <option value="MANUAL">Manual Grade</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newActivity.isRequired}
                    onChange={(e) => setNewActivity({...newActivity, isRequired: e.target.checked})}
                  />
                  Required Activity
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activities list */}
      <div className="activities-list">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No activities found</h3>
            <p>Click "New Activity" to create your first activity</p>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateForm(true)}
              disabled={!selectedCourse}
            >
              Create Activity
            </button>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-header">
                <div className="activity-title">
                  <span className="activity-icon">{getActivityIcon(activity.activityType)}</span>
                  <div>
                    <h3>{activity.title}</h3>
                    <span className="activity-type">{getActivityTypeText(activity.activityType)}</span>
                  </div>
                  <div className={`activity-status ${activity.isPublished ? 'published' : 'draft'}`}>
                    {activity.isPublished ? 'Published' : 'Draft'}
                  </div>
                </div>
                <div className="activity-score">
                  Max Score: {activity.maxScore} pts
                </div>
              </div>
              
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                
                <div className="activity-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>Due: {formatDate(activity.dueDate) || 'No due date'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📎</span>
                    <span>Type: {getSubmissionTypeText(activity.submissionType)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">🔄</span>
                    <span>Attempts: {activity.attemptsAllowed === -1 ? 'Unlimited' : activity.attemptsAllowed}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span>Created: {formatDate(activity.createdAt)}</span>
                  </div>
                </div>

                {activity.activityType === 'QUIZ' && activity.timeLimitMinutes && (
                  <div className="quiz-info">
                    <span className="meta-icon">⏱️</span>
                    <span>Time Limit: {activity.timeLimitMinutes} minutes</span>
                  </div>
                )}
              </div>
              
              <div className="activity-actions">
                {!activity.isPublished && (
                  <button 
                    className="btn-primary"
                    onClick={() => publishActivity(activity.id)}
                  >
                    Publish
                  </button>
                )}
                <button className="btn-secondary">
                  View Submissions (0)
                </button>
                <button className="btn-secondary">
                  Edit
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => deleteActivity(activity.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityManagement;