# 新版本数据库设计 - Activities 系统

## 主要变更说明
1. 将原有的 `assignments` 表重新设计为更通用的 `course_activities` 表
2. 新增支持多种活动类型：assignment、quiz、announcement、practice 等
3. 新增 `quiz_questions` 和 `quiz_answers` 表支持测验功能
4. 修改相关的提交表结构，使其支持多种活动类型

---

## 完整数据库初始化脚本

```sql
--本系统的数据库初始化文件

-- 1. 用户表 (核心表)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('TEACHER', 'STUDENT')),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 课程表
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    teacher_id BIGINT NOT NULL,
    category VARCHAR(50),
    level VARCHAR(20) CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    price DECIMAL(10,2) DEFAULT 0.00,
    duration_hours INTEGER DEFAULT 0,
    max_students INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. 课程章节表
CREATE TABLE course_chapters (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. 课程内容表（视频、文档等）
CREATE TABLE course_contents (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('VIDEO', 'DOCUMENT', 'QUIZ', 'ASSIGNMENT')),
    content_url VARCHAR(500),
    content_text TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES course_chapters(id) ON DELETE CASCADE
);

-- 5. 学生选课表
CREATE TABLE course_enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DROPPED')),
    grade DECIMAL(5,2),
    certificate_url VARCHAR(500),
    UNIQUE(student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 6. 学习进度表
CREATE TABLE learning_progress (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    content_id BIGINT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, content_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES course_contents(id) ON DELETE CASCADE
);

-- 7. 【新设计】课程活动表 (替代原 assignments 表)
CREATE TABLE course_activities (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('ASSIGNMENT', 'QUIZ', 'ANNOUNCEMENT', 'PRACTICE', 'DISCUSSION', 'SURVEY')),
    due_date TIMESTAMP,
    available_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    available_until TIMESTAMP,
    max_score DECIMAL(5,2) DEFAULT 100.00,
    time_limit_minutes INTEGER, -- 测验时间限制
    attempts_allowed INTEGER DEFAULT 1, -- 允许尝试次数
    submission_type VARCHAR(20) DEFAULT 'TEXT' CHECK (submission_type IN ('FILE', 'TEXT', 'URL', 'MULTIPLE_CHOICE', 'MIXED')),
    is_published BOOLEAN DEFAULT false,
    is_required BOOLEAN DEFAULT true,
    weight DECIMAL(5,2) DEFAULT 1.00, -- 活动权重
    grading_method VARCHAR(20) DEFAULT 'MANUAL' CHECK (grading_method IN ('MANUAL', 'AUTO', 'PEER')),
    settings JSON, -- 存储特定活动类型的配置
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 8. 【新增】测验题目表
CREATE TABLE quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'FILL_BLANK')),
    points DECIMAL(5,2) DEFAULT 1.00,
    order_index INTEGER NOT NULL,
    settings JSON, -- 存储题目特定配置（如选项、正确答案等）
    explanation TEXT, -- 题目解析
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES course_activities(id) ON DELETE CASCADE
);

-- 9. 【新增】测验选项表
CREATE TABLE quiz_options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- 10. 【重新设计】活动提交表 (替代原 assignment_submissions 表)
CREATE TABLE activity_submissions (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    submission_data JSON, -- 存储提交内容（文本、文件URL、选择答案等）
    submission_text TEXT,
    file_urls JSON, -- 存储多个文件URL
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2),
    auto_score DECIMAL(5,2), -- 自动评分结果
    manual_score DECIMAL(5,2), -- 手动评分结果
    feedback TEXT,
    auto_feedback JSON, -- 自动反馈
    graded_at TIMESTAMP,
    graded_by BIGINT,
    time_spent_minutes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'GRADED', 'RETURNED', 'LATE_SUBMITTED')),
    is_final BOOLEAN DEFAULT true, -- 是否为最终提交
    FOREIGN KEY (activity_id) REFERENCES course_activities(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. 【新增】学生答案表 (用于测验详细答案记录)
CREATE TABLE student_answers (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer_data JSON, -- 存储学生的答案
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2) DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES activity_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- 12. 通知表
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'INFO' CHECK (type IN ('INFO', 'WARNING', 'SUCCESS', 'ERROR')),
    is_read BOOLEAN DEFAULT false,
    related_id BIGINT,
    related_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. 讨论区表
CREATE TABLE discussions (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT,
    title VARCHAR(200),
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES discussions(id) ON DELETE CASCADE
);

-- 14. AI对话记录表
CREATE TABLE ai_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    message_type VARCHAR(20) DEFAULT 'USER' CHECK (message_type IN ('USER', 'AI')),
    context_type VARCHAR(50),
    context_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 15. 系统设置表
CREATE TABLE system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);

CREATE INDEX idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);

CREATE INDEX idx_progress_student ON learning_progress(student_id);
CREATE INDEX idx_progress_content ON learning_progress(content_id);

CREATE INDEX idx_activities_course ON course_activities(course_id);
CREATE INDEX idx_activities_type ON course_activities(activity_type);
CREATE INDEX idx_activities_published ON course_activities(is_published);
CREATE INDEX idx_activities_due_date ON course_activities(due_date);

CREATE INDEX idx_quiz_questions_activity ON quiz_questions(activity_id);
CREATE INDEX idx_quiz_options_question ON quiz_options(question_id);

CREATE INDEX idx_submissions_activity ON activity_submissions(activity_id);
CREATE INDEX idx_submissions_student ON activity_submissions(student_id);
CREATE INDEX idx_submissions_status ON activity_submissions(status);

CREATE INDEX idx_answers_submission ON student_answers(submission_id);
CREATE INDEX idx_answers_question ON student_answers(question_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

CREATE INDEX idx_discussions_course ON discussions(course_id);
CREATE INDEX idx_discussions_user ON discussions(user_id);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);

-- 插入初始测试数据
INSERT INTO users (username, password, email, full_name, role, bio) VALUES
('teacher1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'teacher1@example.com', 'Teacher Zhang', 'TEACHER', 'Senior educator with 10 years of online education experience'),
('student1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'student1@example.com', 'Student Li', 'STUDENT', 'University student passionate about learning'),
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin@example.com', 'System Admin', 'TEACHER', 'System administrator account');

-- 插入系统设置
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'Online Education Platform', 'Website name'),
('site_description', 'Professional online education platform', 'Website description'),
('max_file_size', '50MB', 'Maximum file upload size'),
('default_course_price', '99.00', 'Default course price');

-- 插入示例课程数据
INSERT INTO courses (title, description, teacher_id, category, level, price, status) VALUES
('Java Programming Basics', 'Learn Java programming from scratch, suitable for beginners', 1, 'Programming', 'BEGINNER', 199.00, 'PUBLISHED'),
('Python Data Analysis', 'Data analysis and visualization using Python', 1, 'Data Science', 'INTERMEDIATE', 299.00, 'PUBLISHED'),
('Web Frontend Development', 'Full-stack development with HTML, CSS, JavaScript', 1, 'Web Development', 'BEGINNER', 249.00, 'DRAFT');

-- 插入示例活动数据
INSERT INTO course_activities (course_id, title, description, activity_type, due_date, max_score, submission_type, is_published) VALUES
(1, 'Java Basics Assignment', 'Write a simple Java program demonstrating basic concepts', 'ASSIGNMENT', '2024-12-01 23:59:59', 100.00, 'FILE', true),
(1, 'Programming Quiz #1', 'Test your understanding of Java basics', 'QUIZ', '2024-11-25 23:59:59', 50.00, 'MULTIPLE_CHOICE', true),
(1, 'Course Welcome Announcement', 'Welcome to Java Programming course!', 'ANNOUNCEMENT', NULL, 0.00, 'TEXT', true),
(2, 'Data Analysis Project', 'Analyze a real dataset using Python', 'ASSIGNMENT', '2024-12-15 23:59:59', 150.00, 'FILE', true),
(2, 'Python Syntax Practice', 'Practice Python syntax with interactive exercises', 'PRACTICE', NULL, 25.00, 'TEXT', true);

-- 插入示例测验题目
INSERT INTO quiz_questions (activity_id, question_text, question_type, points, order_index, settings) VALUES
(2, 'What is the main method signature in Java?', 'MULTIPLE_CHOICE', 5.00, 1, '{"correct_answer": "A"}'),
(2, 'Java is a platform-independent language.', 'TRUE_FALSE', 5.00, 2, '{"correct_answer": true}'),
(2, 'Explain the concept of Object-Oriented Programming', 'SHORT_ANSWER', 10.00, 3, '{"max_length": 500}');

-- 插入测验选项
INSERT INTO quiz_options (question_id, option_text, is_correct, order_index) VALUES
(1, 'public static void main(String[] args)', true, 1),
(1, 'public void main(String args)', false, 2),
(1, 'static void main(String[] args)', false, 3),
(1, 'public main(String[] args)', false, 4);
```

## 数据迁移说明

如果从现有系统升级，需要执行以下迁移步骤：

### 1. 数据迁移脚本
```sql
-- 迁移现有 assignments 数据到 course_activities
INSERT INTO course_activities (
    course_id, title, description, instructions, activity_type, 
    due_date, max_score, submission_type, is_published, created_at, updated_at
)
SELECT 
    course_id, title, description, instructions, 'ASSIGNMENT',
    due_date, max_score, submission_type, is_published, created_at, updated_at
FROM assignments;

-- 迁移 assignment_submissions 到 activity_submissions
INSERT INTO activity_submissions (
    activity_id, student_id, submission_text, submitted_at, 
    score, feedback, graded_at, graded_by, status
)
SELECT 
    (SELECT id FROM course_activities WHERE course_id = a.course_id AND title = a.title LIMIT 1),
    student_id, submission_text, submitted_at, score, feedback, graded_at, graded_by, status
FROM assignment_submissions asub
JOIN assignments a ON asub.assignment_id = a.id;
```

### 2. 删除旧表（谨慎操作）
```sql
-- 备份完成后删除旧表
-- DROP TABLE assignment_submissions;
-- DROP TABLE assignments;
```