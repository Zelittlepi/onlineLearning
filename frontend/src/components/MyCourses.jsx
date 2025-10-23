import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../enrollment-styles.css';
import '../enrollment-styles.css';

const MyCourses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  
  // Course enrollment related state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    category: 'ALL',
    level: 'ALL'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/student/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch course list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get available courses list
  const fetchAvailableCourses = async () => {
    setEnrollLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchFilters.keyword) params.append('keyword', searchFilters.keyword);
      if (searchFilters.category !== 'ALL') params.append('category', searchFilters.category);
      if (searchFilters.level !== 'ALL') params.append('level', searchFilters.level);
      
      const response = await axios.get(`http://localhost:8080/api/student/available-courses?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAvailableCourses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch available courses:', error);
    } finally {
      setEnrollLoading(false);
    }
  };

  // Course enrollment functionality
  const enrollCourse = async (courseId) => {
    if (!confirm('Are you sure you want to enroll in this course?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8080/api/student/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Enrollment successful!');
        setShowEnrollModal(false);
        fetchCourses(); // Refresh course list
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment failed, please try again');
    }
  };

  const dropCourse = async (courseId) => {
    if (!confirm('Are you sure you want to drop this course?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8080/api/student/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Course dropped successfully!');
        fetchCourses(); // Refresh course list
      }
    } catch (error) {
      console.error('Drop course failed:', error);
      alert('Drop course failed, please try again');
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'ACTIVE': return 'Active';
      case 'COMPLETED': return 'Completed';
      case 'NOT_STARTED': return 'Not Started';
      default: return status;
    }
  };

  const getLevelText = (level) => {
    switch(level) {
      case 'BEGINNER': return 'Beginner';
      case 'INTERMEDIATE': return 'Intermediate';
      case 'ADVANCED': return 'Advanced';
      default: return level;
    }
  };

  // Open course selection modal
  const openEnrollModal = () => {
    setShowEnrollModal(true);
    fetchAvailableCourses();
  };

  // Close course selection modal
  const closeEnrollModal = () => {
    setShowEnrollModal(false);
    setSearchFilters({ keyword: '', category: 'ALL', level: 'ALL' });
  };

  // Handle search filters
  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply search filters
  const applyFilters = () => {
    fetchAvailableCourses();
  };

  const filteredCourses = courses.filter(courseInfo => {
    const status = courseInfo.enrollment.status;
    switch(activeTab) {
      case 'active':
        return status === 'ACTIVE';
      case 'completed':
        return status === 'COMPLETED';
      case 'dropped':
        return status === 'DROPPED';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <div className="content-header">
        <h2>📚 My Courses</h2>
        <div className="header-actions">
          <p>View all your enrolled courses</p>
          <button className="btn-primary" onClick={openEnrollModal}>
            ➕ Enroll in New Course
          </button>
        </div>
      </div>

      {/* Course tabs */}
      <div className="course-tabs">
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({courses.filter(c => c.enrollment.status === 'ACTIVE').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({courses.filter(c => c.enrollment.status === 'COMPLETED').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'dropped' ? 'active' : ''}`}
          onClick={() => setActiveTab('dropped')}
        >
          Dropped ({courses.filter(c => c.enrollment.status === 'DROPPED').length})
        </button>
      </div>

      {/* Course list */}
      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses found</h3>
            <p>You don't have any {activeTab === 'active' ? 'active' : activeTab === 'completed' ? 'completed' : 'dropped'} courses yet</p>
          </div>
        ) : (
          filteredCourses.map(courseInfo => {
            const { enrollment, course, actualProgress } = courseInfo;
            return (
              <div key={course.id} className="student-course-card">
                <div className="course-header">
                  <div className="course-category">{course.category}</div>
                  <div className={`course-status ${enrollment.status.toLowerCase()}`}>
                    {getStatusText(enrollment.status)}
                  </div>
                </div>
                
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-meta">
                    <div className="meta-row">
                      <div className="meta-item">
                        <span className="meta-icon">📊</span>
                        <span>Level: {getLevelText(course.level)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⏰</span>
                        <span>Duration: {course.durationHours} hours</span>
                      </div>
                    </div>
                    
                    <div className="meta-row">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>Enrollment Date: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
                      </div>
                      {enrollment.grade && (
                        <div className="meta-item">
                          <span className="meta-icon">🎯</span>
                          <span>Grade: {enrollment.grade} points</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Learning progress */}
                  {enrollment.status === 'ACTIVE' && (
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Learning Progress</span>
                        <span>{enrollment.completionPercentage || 0}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${enrollment.completionPercentage || 0}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="course-actions">
                  {enrollment.status === 'ACTIVE' && (
                    <>
                      <button className="btn-primary">
                        Continue Learning
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => dropCourse(course.id)}
                      >
                        Drop Course
                      </button>
                    </>
                  )}
                  {enrollment.status === 'COMPLETED' && (
                    <>
                      <button className="btn-primary">
                        Review Course
                      </button>
                      {enrollment.certificateUrl && (
                        <button className="btn-secondary">
                          Download Certificate
                        </button>
                      )}
                    </>
                  )}
                  {enrollment.status === 'DROPPED' && (
                    <button className="btn-secondary" disabled>
                      Dropped
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Course enrollment modal */}
      {showEnrollModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Select New Course</h3>
              <button className="close-button" onClick={closeEnrollModal}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Search and filter area */}
              <div className="search-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <label>Search Keywords</label>
                    <input
                      type="text"
                      placeholder="Search course name or description..."
                      value={searchFilters.keyword}
                      onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    />
                  </div>
                  <div className="filter-group">
                    <label>Course Category</label>
                    <select
                      value={searchFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="ALL">All Categories</option>
                      <option value="COMPUTER_SCIENCE">Computer Science</option>
                      <option value="MATHEMATICS">Mathematics</option>
                      <option value="PHYSICS">Physics</option>
                      <option value="CHEMISTRY">Chemistry</option>
                      <option value="BIOLOGY">Biology</option>
                      <option value="ENGINEERING">Engineering</option>
                      <option value="BUSINESS">Business</option>
                      <option value="LANGUAGE">Language</option>
                      <option value="ARTS">Arts</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Difficulty Level</label>
                    <select
                      value={searchFilters.level}
                      onChange={(e) => handleFilterChange('level', e.target.value)}
                    >
                      <option value="ALL">All Levels</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <button className="btn-primary" onClick={applyFilters}>
                      🔍 Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Course list */}
              <div className="available-courses-list">
                {enrollLoading ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading courses...</p>
                  </div>
                ) : availableCourses.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>No available courses</h3>
                    <p>No courses match the search criteria, please try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="courses-grid">
                    {availableCourses.map(course => (
                      <div key={course.id} className="available-course-card">
                        <div className="course-header">
                          <div className="course-category">{course.category}</div>
                          <div className={`course-level ${course.level.toLowerCase()}`}>
                            {getLevelText(course.level)}
                          </div>
                        </div>
                        
                        <div className="course-content">
                          <h3>{course.title}</h3>
                          <p className="course-description">{course.description}</p>
                          
                          <div className="course-meta">
                            <div className="meta-row">
                              <div className="meta-item">
                                <span className="meta-icon">⏰</span>
                                <span>Duration: {course.durationHours} hours</span>
                              </div>
                              <div className="meta-item">
                                <span className="meta-icon">📊</span>
                                <span>Level: {getLevelText(course.level)}</span>
                              </div>
                            </div>
                            
                            {course.teacherName && (
                              <div className="meta-row">
                                <div className="meta-item">
                                  <span className="meta-icon">👨‍🏫</span>
                                  <span>Teacher: {course.teacherName}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="meta-row">
                              <div className="meta-item">
                                <span className="meta-icon">📅</span>
                                <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="course-actions">
                          <button 
                            className="btn-primary"
                            onClick={() => enrollCourse(course.id)}
                          >
                            Enroll Course
                          </button>
                          <button className="btn-secondary">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeEnrollModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;