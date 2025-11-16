import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Grades.css';

const Grades = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [gradesSummary, setGradesSummary] = useState({
    totalPoints: 0,
    earnedPoints: 0,
    averageGrade: 0,
    completedActivities: 0,
    totalActivities: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchEnrolledCourses();
      fetchAllGrades();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/students/${user.id}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    }
  };

  const fetchAllGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/submissions/student/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const submissions = response.data || [];
      setGrades(submissions);
      calculateGradesSummary(submissions);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseGrades = async (courseId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // 获取课程的所有活动
      const activitiesResponse = await axios.get(`http://localhost:8080/api/activities/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const activities = activitiesResponse.data || [];
      
      // 获取学生在该课程的所有提交
      const submissionsResponse = await axios.get(`http://localhost:8080/api/submissions/student/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allSubmissions = submissionsResponse.data || [];
      
      // 匹配活动和提交
      const courseGrades = activities.map(activity => {
        const submission = allSubmissions.find(sub => sub.activityId === activity.id);
        return {
          ...activity,
          submission: submission || null,
          grade: submission ? submission.score : null,
          maxScore: activity.maxScore,
          percentage: submission && submission.score !== null ? 
            ((submission.score / activity.maxScore) * 100).toFixed(1) : null,
          status: submission ? submission.status : 'NOT_SUBMITTED'
        };
      });
      
      setGrades(courseGrades);
      calculateGradesSummary(allSubmissions.filter(sub => 
        activities.some(act => act.id === sub.activityId)
      ));
    } catch (error) {
      console.error('Failed to fetch course grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGradesSummary = (submissions) => {
    const gradedSubmissions = submissions.filter(sub => sub.score !== null && sub.score !== undefined);
    
    const totalEarned = gradedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
    const totalPossible = gradedSubmissions.reduce((sum, sub) => {
      // 这里需要获取对应activity的maxScore，暂时使用100作为默认值
      return sum + (sub.maxScore || 100);
    }, 0);
    
    const averageGrade = gradedSubmissions.length > 0 ? 
      (totalEarned / totalPossible * 100).toFixed(1) : 0;
    
    setGradesSummary({
      totalPoints: totalPossible,
      earnedPoints: totalEarned,
      averageGrade: averageGrade,
      completedActivities: gradedSubmissions.length,
      totalActivities: submissions.length
    });
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'grade-a';
    if (percentage >= 80) return 'grade-b';
    if (percentage >= 70) return 'grade-c';
    if (percentage >= 60) return 'grade-d';
    return 'grade-f';
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'GRADED': return '✅';
      case 'SUBMITTED': return '⏳';
      case 'NOT_SUBMITTED': return '❌';
      case 'RETURNED': return '🔄';
      default: return '📝';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'GRADED': return 'Graded';
      case 'SUBMITTED': return 'Submitted';
      case 'NOT_SUBMITTED': return 'Not Submitted';
      case 'RETURNED': return 'Returned';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const filteredGrades = grades.filter(grade => {
    if (activeTab === 'all') return true;
    if (activeTab === 'graded') return grade.status === 'GRADED';
    if (activeTab === 'pending') return grade.status === 'SUBMITTED';
    if (activeTab === 'missing') return grade.status === 'NOT_SUBMITTED';
    return true;
  });

  if (loading) {
    return (
      <div className="grades-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grades-container">
      <div className="grades-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="icon">📊</span>
            My Grades
          </h1>
          <p className="page-subtitle">Track your academic progress across all courses</p>
        </div>
      </div>

      {/* 成绩概览 */}
      <div className="grades-overview">
        <div className="overview-card">
          <div className="overview-item">
            <div className="overview-icon">🎯</div>
            <div className="overview-content">
              <div className="overview-value">{gradesSummary.averageGrade}%</div>
              <div className="overview-label">Overall Average</div>
            </div>
          </div>
          <div className="overview-item">
            <div className="overview-icon">📈</div>
            <div className="overview-content">
              <div className="overview-value">
                {gradesSummary.earnedPoints}/{gradesSummary.totalPoints}
              </div>
              <div className="overview-label">Points Earned</div>
            </div>
          </div>
          <div className="overview-item">
            <div className="overview-icon">✅</div>
            <div className="overview-content">
              <div className="overview-value">
                {gradesSummary.completedActivities}/{gradesSummary.totalActivities}
              </div>
              <div className="overview-label">Activities Completed</div>
            </div>
          </div>
          <div className="overview-item">
            <div className="overview-icon">🏆</div>
            <div className="overview-content">
              <div className="overview-value">
                {getLetterGrade(gradesSummary.averageGrade)}
              </div>
              <div className="overview-label">Letter Grade</div>
            </div>
          </div>
        </div>
      </div>

      {/* 课程筛选 */}
      <div className="course-filter">
        <div className="filter-section">
          <h3>Filter by Course</h3>
          <div className="course-buttons">
            <button
              className={`course-btn ${!selectedCourse ? 'active' : ''}`}
              onClick={() => {
                setSelectedCourse(null);
                fetchAllGrades();
              }}
            >
              All Courses
            </button>
            {courses.map(course => (
              <button
                key={course.id}
                className={`course-btn ${selectedCourse?.id === course.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCourse(course);
                  fetchCourseGrades(course.id);
                }}
              >
                {course.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 成绩筛选标签 */}
      <div className="grade-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({filteredGrades.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'graded' ? 'active' : ''}`}
          onClick={() => setActiveTab('graded')}
        >
          Graded ({grades.filter(g => g.status === 'GRADED').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({grades.filter(g => g.status === 'SUBMITTED').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'missing' ? 'active' : ''}`}
          onClick={() => setActiveTab('missing')}
        >
          Missing ({grades.filter(g => g.status === 'NOT_SUBMITTED').length})
        </button>
      </div>

      {/* 成绩列表 */}
      <div className="grades-content">
        {filteredGrades.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No grades to display</h3>
            <p>
              {selectedCourse ? 
                `No activities found for ${selectedCourse.title}` :
                'You haven\'t received any grades yet'
              }
            </p>
          </div>
        ) : (
          <div className="grades-table">
            <div className="table-header">
              <div className="col-activity">Activity</div>
              <div className="col-course">Course</div>
              <div className="col-due">Due Date</div>
              <div className="col-status">Status</div>
              <div className="col-score">Score</div>
              <div className="col-grade">Grade</div>
            </div>
            
            {filteredGrades.map((item, index) => (
              <div key={item.id || index} className="table-row">
                <div className="col-activity">
                  <div className="activity-info">
                    <span className="activity-icon">
                      {item.activityType === 'QUIZ' ? '🧪' : 
                       item.activityType === 'ASSIGNMENT' ? '📝' : '📋'}
                    </span>
                    <div>
                      <div className="activity-name">{item.title}</div>
                      <div className="activity-type">{item.activityType}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-course">
                  <span className="course-name">{item.courseName || selectedCourse?.title || 'N/A'}</span>
                </div>
                
                <div className="col-due">
                  <span className="due-date">{formatDate(item.dueDate)}</span>
                </div>
                
                <div className="col-status">
                  <div className={`status-badge ${item.status?.toLowerCase()}`}>
                    <span className="status-icon">{getStatusIcon(item.status)}</span>
                    <span className="status-text">{getStatusText(item.status)}</span>
                  </div>
                </div>
                
                <div className="col-score">
                  {item.grade !== null && item.grade !== undefined ? (
                    <span className="score-display">
                      {item.grade}/{item.maxScore}
                    </span>
                  ) : (
                    <span className="score-pending">--</span>
                  )}
                </div>
                
                <div className="col-grade">
                  {item.percentage ? (
                    <div className={`grade-display ${getGradeColor(item.percentage)}`}>
                      <span className="grade-percentage">{item.percentage}%</span>
                      <span className="grade-letter">{getLetterGrade(item.percentage)}</span>
                    </div>
                  ) : (
                    <span className="grade-pending">--</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;