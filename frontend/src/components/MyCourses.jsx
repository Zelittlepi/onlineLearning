import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../enrollment-styles.css';
import '../enrollment-styles.css';

const MyCourses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  
  // 选课相关状态
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
      console.error('获取课程列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取可选课程列表
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
      console.error('获取可选课程失败:', error);
    } finally {
      setEnrollLoading(false);
    }
  };

  // 选课功能
  const enrollCourse = async (courseId) => {
    if (!confirm('确定要选择这门课程吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8080/api/student/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('选课成功！');
        setShowEnrollModal(false);
        fetchCourses(); // 重新获取课程列表
      }
    } catch (error) {
      console.error('选课失败:', error);
      alert('选课失败，请重试');
    }
  };

  const dropCourse = async (courseId) => {
    if (!confirm('确定要退出这门课程吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8080/api/student/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('退课成功！');
        fetchCourses(); // 重新获取课程列表
      }
    } catch (error) {
      console.error('退课失败:', error);
      alert('退课失败，请重试');
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'ACTIVE': return '进行中';
      case 'COMPLETED': return '已完成';
      case 'DROPPED': return '已退课';
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

  // 打开选课模态框
  const openEnrollModal = () => {
    setShowEnrollModal(true);
    fetchAvailableCourses();
  };

  // 关闭选课模态框
  const closeEnrollModal = () => {
    setShowEnrollModal(false);
    setSearchFilters({ keyword: '', category: 'ALL', level: 'ALL' });
  };

  // 处理搜索筛选
  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 应用搜索筛选
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
        <p>加载课程中...</p>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <div className="content-header">
        <h2>📚 我的课程</h2>
        <div className="header-actions">
          <p>查看您已选修的所有课程</p>
          <button className="btn-primary" onClick={openEnrollModal}>
            ➕ 选择新课程
          </button>
        </div>
      </div>

      {/* 课程标签页 */}
      <div className="course-tabs">
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          进行中 ({courses.filter(c => c.enrollment.status === 'ACTIVE').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          已完成 ({courses.filter(c => c.enrollment.status === 'COMPLETED').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'dropped' ? 'active' : ''}`}
          onClick={() => setActiveTab('dropped')}
        >
          已退课 ({courses.filter(c => c.enrollment.status === 'DROPPED').length})
        </button>
      </div>

      {/* 课程列表 */}
      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>暂无课程</h3>
            <p>您还没有{activeTab === 'active' ? '正在学习的' : activeTab === 'completed' ? '已完成的' : '已退的'}课程</p>
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
                        <span>级别: {getLevelText(course.level)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⏰</span>
                        <span>时长: {course.durationHours}小时</span>
                      </div>
                    </div>
                    
                    <div className="meta-row">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>选课时间: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
                      </div>
                      {enrollment.grade && (
                        <div className="meta-item">
                          <span className="meta-icon">🎯</span>
                          <span>成绩: {enrollment.grade}分</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 学习进度 */}
                  {enrollment.status === 'ACTIVE' && (
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>学习进度</span>
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
                        继续学习
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => dropCourse(course.id)}
                      >
                        退课
                      </button>
                    </>
                  )}
                  {enrollment.status === 'COMPLETED' && (
                    <>
                      <button className="btn-primary">
                        复习课程
                      </button>
                      {enrollment.certificateUrl && (
                        <button className="btn-secondary">
                          下载证书
                        </button>
                      )}
                    </>
                  )}
                  {enrollment.status === 'DROPPED' && (
                    <button className="btn-secondary" disabled>
                      已退课
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 选课模态框 */}
      {showEnrollModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>选择新课程</h3>
              <button className="close-button" onClick={closeEnrollModal}>×</button>
            </div>
            
            <div className="modal-body">
              {/* 搜索和筛选区域 */}
              <div className="search-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <label>搜索关键词</label>
                    <input
                      type="text"
                      placeholder="搜索课程名称或描述..."
                      value={searchFilters.keyword}
                      onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    />
                  </div>
                  <div className="filter-group">
                    <label>课程分类</label>
                    <select
                      value={searchFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="ALL">全部分类</option>
                      <option value="COMPUTER_SCIENCE">计算机科学</option>
                      <option value="MATHEMATICS">数学</option>
                      <option value="PHYSICS">物理</option>
                      <option value="CHEMISTRY">化学</option>
                      <option value="BIOLOGY">生物</option>
                      <option value="ENGINEERING">工程</option>
                      <option value="BUSINESS">商科</option>
                      <option value="LANGUAGE">语言</option>
                      <option value="ARTS">艺术</option>
                      <option value="OTHER">其他</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>难度等级</label>
                    <select
                      value={searchFilters.level}
                      onChange={(e) => handleFilterChange('level', e.target.value)}
                    >
                      <option value="ALL">全部等级</option>
                      <option value="BEGINNER">初级</option>
                      <option value="INTERMEDIATE">中级</option>
                      <option value="ADVANCED">高级</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <button className="btn-primary" onClick={applyFilters}>
                      🔍 搜索
                    </button>
                  </div>
                </div>
              </div>

              {/* 课程列表 */}
              <div className="available-courses-list">
                {enrollLoading ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p>加载课程中...</p>
                  </div>
                ) : availableCourses.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>暂无可选课程</h3>
                    <p>没有找到符合条件的课程，请尝试调整搜索条件</p>
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
                                <span>时长: {course.durationHours}小时</span>
                              </div>
                              <div className="meta-item">
                                <span className="meta-icon">📊</span>
                                <span>级别: {getLevelText(course.level)}</span>
                              </div>
                            </div>
                            
                            {course.teacherName && (
                              <div className="meta-row">
                                <div className="meta-item">
                                  <span className="meta-icon">👨‍🏫</span>
                                  <span>教师: {course.teacherName}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="meta-row">
                              <div className="meta-item">
                                <span className="meta-icon">📅</span>
                                <span>创建时间: {new Date(course.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="course-actions">
                          <button 
                            className="btn-primary"
                            onClick={() => enrollCourse(course.id)}
                          >
                            选择课程
                          </button>
                          <button className="btn-secondary">
                            查看详情
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
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;