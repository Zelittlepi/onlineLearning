-- ============================================
-- 在线教育系统数据库初始化文件
-- 包含完整的Activities系统支持
-- 可在空环境中建立所有数据表
-- ============================================

-- 1. 用户表 (核心表)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('TEACHER', 'STUDENT', 'ADMIN')),
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

-- 7. 课程活动表（新Activities系统核心表）
CREATE TABLE course_activities (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('ASSIGNMENT', 'QUIZ', 'ANNOUNCEMENT', 'PRACTICE', 'DISCUSSION', 'SURVEY')),
    due_date TIMESTAMP,
    available_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    available_until TIMESTAMP,
    max_score DECIMAL(5,2) DEFAULT 100.00,
    time_limit_minutes INTEGER,
    attempts_allowed INTEGER DEFAULT 1,
    submission_type VARCHAR(20) DEFAULT 'TEXT' CHECK (submission_type IN ('FILE', 'TEXT', 'URL', 'MULTIPLE_CHOICE', 'MIXED')),
    is_published BOOLEAN DEFAULT false,
    is_required BOOLEAN DEFAULT true,
    weight DECIMAL(5,2) DEFAULT 1.00,
    grading_method VARCHAR(20) DEFAULT 'MANUAL' CHECK (grading_method IN ('MANUAL', 'AUTO', 'PEER')),
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. 测验题目表
CREATE TABLE quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'FILL_BLANK')),
    points DECIMAL(5,2) DEFAULT 1.00,
    order_index INTEGER NOT NULL,
    settings JSON,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES course_activities(id) ON DELETE CASCADE
);

-- 9. 测验选项表
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

-- 10. 活动提交表（新Activities系统提交表）
CREATE TABLE activity_submissions (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    submission_data JSON,
    submission_text TEXT,
    file_urls JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2),
    auto_score DECIMAL(5,2),
    manual_score DECIMAL(5,2),
    feedback TEXT,
    auto_feedback JSON,
    graded_at TIMESTAMP,
    graded_by BIGINT,
    time_spent_minutes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'GRADED', 'RETURNED', 'LATE_SUBMITTED')),
    is_late BOOLEAN DEFAULT false,
    is_final BOOLEAN DEFAULT true,
    FOREIGN KEY (activity_id) REFERENCES course_activities(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. 学生答案表
CREATE TABLE student_answers (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer_data JSON,
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2) DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES activity_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- 12. 作业表（保留向后兼容）
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMP,
    max_score DECIMAL(5,2) DEFAULT 100.00,
    submission_type VARCHAR(20) DEFAULT 'FILE' CHECK (submission_type IN ('FILE', 'TEXT', 'URL')),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 13. 作业提交表（保留向后兼容）
CREATE TABLE assignment_submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submission_text TEXT,
    file_url VARCHAR(500),
    submission_url VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2),
    feedback TEXT,
    graded_at TIMESTAMP,
    graded_by BIGINT,
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'GRADED', 'RETURNED')),
    UNIQUE(assignment_id, student_id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 14. 通知表
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

-- 15. 讨论区表
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

-- 16. AI对话记录表
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

-- 17. 系统设置表
CREATE TABLE system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 创建索引以提高查询性能
-- ============================================

-- 用户表索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 课程表索引
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);

-- 选课表索引
CREATE INDEX idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);

-- 学习进度表索引
CREATE INDEX idx_progress_student ON learning_progress(student_id);
CREATE INDEX idx_progress_content ON learning_progress(content_id);

-- Activities 系统索引
CREATE INDEX idx_activities_course ON course_activities(course_id);
CREATE INDEX idx_activities_teacher ON course_activities(teacher_id);
CREATE INDEX idx_activities_type ON course_activities(activity_type);
CREATE INDEX idx_activities_published ON course_activities(is_published);
CREATE INDEX idx_activities_due_date ON course_activities(due_date);

-- Quiz 相关索引
CREATE INDEX idx_quiz_questions_activity ON quiz_questions(activity_id);
CREATE INDEX idx_quiz_options_question ON quiz_options(question_id);

-- 活动提交表索引
CREATE INDEX idx_activity_submissions_activity ON activity_submissions(activity_id);
CREATE INDEX idx_activity_submissions_student ON activity_submissions(student_id);
CREATE INDEX idx_activity_submissions_status ON activity_submissions(status);

-- 学生答案表索引
CREATE INDEX idx_student_answers_submission ON student_answers(submission_id);
CREATE INDEX idx_student_answers_question ON student_answers(question_id);

-- 传统作业表索引（向后兼容）
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_published ON assignments(is_published);
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);

-- 传统作业表索引（向后兼容）
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_published ON assignments(is_published);
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);

-- 其他表索引
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

CREATE INDEX idx_discussions_course ON discussions(course_id);
CREATE INDEX idx_discussions_user ON discussions(user_id);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);

-- ============================================
-- 插入初始测试数据
-- ============================================

-- 插入用户数据
INSERT INTO users (username, password, email, full_name, role, bio) VALUES
('teacher1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'teacher1@example.com', 'Prof. Zhang', 'TEACHER', 'Senior educator specializing in online education for 10 years'),
('student1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'student1@example.com', 'Li Ming', 'STUDENT', 'University student passionate about learning'),
('student2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'student2@example.com', 'Wang Xiaoli', 'STUDENT', 'Computer science major interested in programming'),
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin@example.com', 'System Admin', 'ADMIN', 'System administrator account');

-- 插入系统设置
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'PolyU Learning Hub', 'Website name'),
('site_description', 'Professional online education platform', 'Website description'),
('max_file_size', '50MB', 'Maximum file upload size'),
('default_course_price', '99.00', 'Default course price'),
('auto_grading_enabled', 'true', 'Enable automatic grading for quizzes'),
('discussion_enabled', 'true', 'Enable course discussions'),
('ai_assistant_enabled', 'true', 'Enable AI assistant feature');

-- 插入示例课程数据
INSERT INTO courses (title, description, teacher_id, category, level, price, status) VALUES
('Java Programming Fundamentals', 'Learn Java programming from scratch, suitable for beginners', 1, 'Programming', 'BEGINNER', 199.00, 'PUBLISHED'),
('Python Data Analysis', 'Data analysis and visualization using Python', 1, 'Data Science', 'INTERMEDIATE', 299.00, 'PUBLISHED'),
('Web Frontend Development', 'Full-stack development with HTML, CSS, JavaScript', 1, 'Web Development', 'BEGINNER', 249.00, 'PUBLISHED'),
('Advanced Algorithms', 'Advanced algorithmic concepts and problem solving', 1, 'Computer Science', 'ADVANCED', 399.00, 'DRAFT');

-- 插入课程章节数据
INSERT INTO course_chapters (course_id, title, description, order_index) VALUES
(1, 'Introduction to Java', 'Basic concepts and setup', 1),
(1, 'Variables and Data Types', 'Understanding Java data types', 2),
(1, 'Control Structures', 'Loops and conditional statements', 3),
(1, 'Object-Oriented Programming', 'Classes, objects, and inheritance', 4),
(2, 'Python Basics', 'Python syntax and fundamentals', 1),
(2, 'Data Manipulation with Pandas', 'Working with data using Pandas library', 2),
(2, 'Data Visualization', 'Creating charts and graphs', 3);

-- 插入课程内容数据
INSERT INTO course_contents (chapter_id, title, content_type, order_index, duration_minutes, is_free) VALUES
(1, 'Welcome to Java', 'VIDEO', 1, 15, true),
(1, 'Installing Java JDK', 'DOCUMENT', 2, 10, true),
(1, 'Your First Java Program', 'VIDEO', 3, 20, false),
(2, 'Primitive Data Types', 'VIDEO', 1, 25, false),
(2, 'String Manipulation', 'VIDEO', 2, 30, false),
(3, 'If-Else Statements', 'VIDEO', 1, 20, false),
(3, 'Loops in Java', 'VIDEO', 2, 35, false);

-- 插入学生选课数据
INSERT INTO course_enrollments (student_id, course_id, completion_percentage, status) VALUES
(2, 1, 25.5, 'ACTIVE'),
(2, 2, 0.0, 'ACTIVE'),
(3, 1, 85.0, 'ACTIVE'),
(3, 3, 15.0, 'ACTIVE');

-- 插入课程活动数据（Activities系统）
INSERT INTO course_activities (course_id, teacher_id, title, description, instructions, activity_type, due_date, max_score, submission_type, is_published, time_limit_minutes, attempts_allowed, grading_method) VALUES
-- Java课程活动
(1, 1, 'Java Programming Assignment #1', 'Create a simple Java program demonstrating basic OOP concepts', 'Write a Java class that includes constructors, methods, and inheritance. Submit your .java files.', 'ASSIGNMENT', NOW() + INTERVAL '30 days', 100.00, 'FILE', true, NULL, 3, 'MANUAL'),
(1, 1, 'Java Basics Quiz', 'Test your understanding of Java fundamentals', 'Answer all questions within the time limit. You have 2 attempts.', 'QUIZ', NOW() + INTERVAL '15 days', 50.00, 'MULTIPLE_CHOICE', true, 30, 2, 'AUTO'),
(1, 1, 'Course Welcome Announcement', 'Welcome to Java Programming Course!', 'Welcome everyone! Please read the course syllabus and introduction materials.', 'ANNOUNCEMENT', NULL, 0.00, 'TEXT', true, NULL, 1, 'MANUAL'),
(1, 1, 'Java Syntax Practice', 'Interactive Java coding practice', 'Practice Java syntax with hands-on exercises. No time limit, practice as much as you need.', 'PRACTICE', NULL, 25.00, 'TEXT', true, NULL, 999, 'AUTO'),

-- Python数据分析课程活动
(2, 1, 'Data Analysis Project', 'Analyze real-world dataset', 'Choose a dataset and perform comprehensive analysis using Python. Create visualizations and insights.', 'ASSIGNMENT', NOW() + INTERVAL '45 days', 150.00, 'FILE', true, NULL, 1, 'MANUAL'),
(2, 1, 'Python Fundamentals Quiz', 'Basic Python syntax and concepts', 'Test your knowledge of Python variables, functions, and data structures.', 'QUIZ', NOW() + INTERVAL '20 days', 75.00, 'MULTIPLE_CHOICE', true, 45, 2, 'AUTO'),

-- Web开发课程活动
(3, 1, 'HTML/CSS Layout Assignment', 'Create a responsive web page layout', 'Design and implement a responsive website using HTML5 and CSS3. Include mobile-first design.', 'ASSIGNMENT', NOW() + INTERVAL '25 days', 120.00, 'FILE', true, NULL, 2, 'MANUAL'),
(3, 1, 'JavaScript Fundamentals Quiz', 'JavaScript basics and DOM manipulation', 'Test your knowledge of JavaScript variables, functions, and DOM operations.', 'QUIZ', NOW() + INTERVAL '20 days', 75.00, 'MULTIPLE_CHOICE', true, 45, 2, 'AUTO');

-- 插入测验题目和选项
-- Java Basics Quiz 题目 (activity_id = 2)
INSERT INTO quiz_questions (activity_id, question_text, question_type, points, order_index, explanation) VALUES
(2, 'What is the correct way to declare a main method in Java?', 'MULTIPLE_CHOICE', 5.00, 1, 'The main method must be public, static, void and take String array as parameter'),
(2, 'Java is platform independent. True or False?', 'TRUE_FALSE', 5.00, 2, 'Java bytecode can run on any platform with JVM installed'),
(2, 'What does OOP stand for?', 'SHORT_ANSWER', 10.00, 3, 'Object-Oriented Programming is a programming paradigm based on objects'),
(2, 'Which keyword is used to create a subclass in Java?', 'MULTIPLE_CHOICE', 5.00, 4, 'The extends keyword is used for inheritance in Java'),
(2, 'Explain the difference between == and .equals() in Java', 'ESSAY', 15.00, 5, 'This tests understanding of reference vs value comparison');

-- Java Quiz 选择题选项
INSERT INTO quiz_options (question_id, option_text, is_correct, order_index, explanation) VALUES
-- Question 1 options
(1, 'public static void main(String[] args)', true, 1, 'Correct main method signature'),
(1, 'public void main(String args)', false, 2, 'Missing static keyword'),
(1, 'static void main(String[] args)', false, 3, 'Missing public access modifier'),
(1, 'public main(String[] args)', false, 4, 'Missing static and void keywords'),

-- Question 4 options
(4, 'extends', true, 1, 'Correct keyword for inheritance'),
(4, 'implements', false, 2, 'Used for interfaces, not classes'),
(4, 'inherits', false, 3, 'Not a Java keyword'),
(4, 'super', false, 4, 'Used to call parent methods, not declare inheritance');

-- JavaScript Fundamentals Quiz 题目 (activity_id = 8)
INSERT INTO quiz_questions (activity_id, question_text, question_type, points, order_index, explanation) VALUES
(8, 'Which of the following is the correct way to declare a variable in JavaScript?', 'MULTIPLE_CHOICE', 5.00, 1, 'let and const are modern ways to declare variables'),
(8, 'JavaScript is a compiled language. True or False?', 'TRUE_FALSE', 5.00, 2, 'JavaScript is an interpreted language, not compiled'),
(8, 'What is the purpose of DOM in web development?', 'SHORT_ANSWER', 10.00, 3, 'Document Object Model allows dynamic manipulation of web pages'),
(8, 'Which method is used to add an event listener to an element?', 'MULTIPLE_CHOICE', 5.00, 4, 'addEventListener is the standard method for attaching events');

-- JavaScript Quiz 选择题选项
INSERT INTO quiz_options (question_id, option_text, is_correct, order_index, explanation) VALUES
-- Question 6 options (JavaScript variable declaration)
(6, 'let myVar = 5;', true, 1, 'Modern ES6+ variable declaration'),
(6, 'variable myVar = 5;', false, 2, 'Not valid JavaScript syntax'),
(6, 'declare myVar = 5;', false, 3, 'Not valid JavaScript syntax'),
(6, 'def myVar = 5;', false, 4, 'Python syntax, not JavaScript'),

-- Question 9 options (Event listener method)
(9, 'addEventListener()', true, 1, 'Standard method for adding event listeners'),
(9, 'attachEvent()', false, 2, 'Old IE-specific method'),
(9, 'onClick()', false, 3, 'HTML attribute, not a JavaScript method'),
(9, 'bindEvent()', false, 4, 'Not a standard JavaScript method');

-- 插入示例提交数据
INSERT INTO activity_submissions (activity_id, student_id, submission_text, submitted_at, status, score, feedback, graded_by) VALUES
-- Java Assignment submissions
(1, 2, 'Submitted Java OOP assignment with Car and Vehicle classes demonstrating inheritance.', NOW() - INTERVAL '2 days', 'GRADED', 85.00, 'Good implementation of OOP concepts. Consider adding more comments and error handling.', 1),

-- Java Quiz submissions (student_id = 2)
(2, 2, NULL, NOW() - INTERVAL '5 days', 'GRADED', 40.00, 'Well done! Review the concepts you missed and try again if needed.', NULL);

-- 插入学生答案数据（对应上面的quiz提交）
INSERT INTO student_answers (submission_id, question_id, answer_data, is_correct, points_earned, time_spent_seconds) VALUES
-- Java Quiz answers for submission_id = 2
(2, 1, '{"selected_option": 1, "option_text": "public static void main(String[] args)"}', true, 5.00, 45),
(2, 2, '{"answer": true}', true, 5.00, 30),
(2, 3, '{"answer": "Object-Oriented Programming"}', true, 10.00, 120),
(2, 4, '{"selected_option": 1, "option_text": "extends"}', true, 5.00, 25),
(2, 5, '{"answer": "== compares references while .equals() compares values for objects"}', true, 15.00, 300);

-- 插入学习进度数据
INSERT INTO learning_progress (student_id, content_id, is_completed, completion_date, time_spent_minutes) VALUES
(2, 1, true, NOW() - INTERVAL '10 days', 15),
(2, 2, true, NOW() - INTERVAL '9 days', 12),
(2, 3, false, NULL, 8),
(3, 1, true, NOW() - INTERVAL '15 days', 20),
(3, 2, true, NOW() - INTERVAL '14 days', 15),
(3, 3, true, NOW() - INTERVAL '13 days', 25),
(3, 4, true, NOW() - INTERVAL '12 days', 30);

-- 插入通知数据
INSERT INTO notifications (user_id, title, message, type, related_id, related_type) VALUES
(2, 'New Assignment Available', 'Java Programming Assignment #1 has been published', 'INFO', 1, 'ACTIVITY'),
(2, 'Quiz Reminder', 'Java Basics Quiz is due in 3 days', 'WARNING', 2, 'ACTIVITY'),
(3, 'Assignment Graded', 'Your Java assignment has been graded', 'SUCCESS', 1, 'SUBMISSION'),
(2, 'Welcome to Course', 'Welcome to Java Programming Fundamentals!', 'INFO', 1, 'COURSE');

-- 完成！在线教育系统数据库已成功初始化
SELECT 'Online Education System database setup completed successfully!' as status;