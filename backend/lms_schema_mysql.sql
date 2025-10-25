-- ============================================
--  LMS DATABASE SCHEMA (MySQL version)
-- ============================================

CREATE DATABASE IF NOT EXISTS lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lms;

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    -- Thông tin cơ bản
    full_name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female', 'other'),
    date_of_birth DATE,
    phone VARCHAR(20),
    address TEXT,
    avatar_url TEXT,

    role ENUM('admin', 'teacher', 'student') NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================
-- FACULTIES
-- ============================================
CREATE TABLE faculties (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DEPARTMENTS
-- ============================================
CREATE TABLE departments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    faculty_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);
CREATE INDEX idx_departments_faculty ON departments(faculty_id);

-- ============================================
-- TEACHERS (Kế thừa từ bảng users)
-- ============================================
CREATE TABLE teachers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) UNIQUE NOT NULL,         
    teacher_code VARCHAR(50) UNIQUE NOT NULL,    

    -- Thông tin nghề nghiệp
    faculty_id CHAR(36),
    department_id CHAR(36),
    position VARCHAR(100),
    degree VARCHAR(100),
    specialization VARCHAR(255),     -- Chuyên môn chính

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Ràng buộc khóa ngoại
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Tối ưu truy vấn
CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_teachers_code ON teachers(teacher_code);
CREATE INDEX idx_teachers_faculty ON teachers(faculty_id);
CREATE INDEX idx_teachers_department ON teachers(department_id);

-- ============================================
-- STUDENTS (Kế thừa từ bảng users)
-- ============================================
CREATE TABLE students (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) UNIQUE NOT NULL,              
    student_code VARCHAR(50) UNIQUE NOT NULL,      

    -- Thông tin học tập riêng
    administrative_class VARCHAR(50),               -- Lớp hành chính
    faculty_id CHAR(36),
    department_id CHAR(36),
    status ENUM('studying', 'reserved', 'leave', 'graduated') DEFAULT 'studying',
    year_of_admission INT,                          -- Năm nhập học
    academic_year VARCHAR(20),                      -- Niên khóa
    advisor_id CHAR(36),                            -- Cố vấn học tập (liên kết teachers)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Khóa ngoại
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (advisor_id) REFERENCES teachers(id)
);

-- Tối ưu truy vấn
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_code ON students(student_code);
CREATE INDEX idx_students_faculty ON students(faculty_id);
CREATE INDEX idx_students_department ON students(department_id);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE courses (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department_id CHAR(36),
    credits INT NOT NULL,
    created_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_department ON courses(department_id);

-- ============================================
-- CLASSES
-- ============================================
CREATE TABLE classes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    lecturer_id CHAR(36) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    schedule TEXT,
    max_capacity INT DEFAULT 40,
    current_enrollment INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lecturer_id) REFERENCES teachers(id)
);
CREATE INDEX idx_classes_course ON classes(course_id);
CREATE INDEX idx_classes_lecturer ON classes(lecturer_id);
CREATE INDEX idx_classes_semester_year ON classes(semester, year);

-- ============================================
-- ENROLLMENTS
-- ============================================
CREATE TABLE enrollments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    class_id CHAR(36) NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'dropped', 'completed') DEFAULT 'active',
    UNIQUE (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);

-- ============================================
-- MATERIALS
-- ============================================
CREATE TABLE materials (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    class_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by CHAR(36) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
CREATE INDEX idx_materials_class ON materials(class_id);

-- ============================================
-- ASSIGNMENTS
-- ============================================
CREATE TABLE assignments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    class_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    max_points DECIMAL(5,2) NOT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- ============================================
-- SUBMISSIONS
-- ============================================
CREATE TABLE submissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    assignment_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_name VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    status ENUM('pending', 'graded', 'late') DEFAULT 'pending',
    score DECIMAL(5,2),
    feedback TEXT,
    graded_at TIMESTAMP,
    graded_by CHAR(36),
    UNIQUE (assignment_id, student_id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id)
);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);

-- ============================================
-- ATTENDANCE RECORDS
-- ============================================
CREATE TABLE attendance_records (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    class_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (class_id, student_id, date),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
CREATE INDEX idx_attendance_class_date ON attendance_records(class_id, date);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);

-- ============================================
-- CLASS GRADE SUBMISSIONS
-- ============================================
CREATE TABLE class_grade_submissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    class_id CHAR(36) NOT NULL,
    teacher_id CHAR(36) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('draft', 'pending_approval', 'approved', 'rejected') DEFAULT 'draft',
    approved_by CHAR(36),
    approved_at TIMESTAMP,
    rejected_by CHAR(36),
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    grades JSON NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (rejected_by) REFERENCES users(id)
);
CREATE INDEX idx_grade_submissions_class ON class_grade_submissions(class_id);
CREATE INDEX idx_grade_submissions_status ON class_grade_submissions(status);

-- ============================================
-- EXAMS
-- ============================================
CREATE TABLE exams (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    class_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    total_points DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);
CREATE INDEX idx_exams_class ON exams(class_id);

-- ============================================
-- QUESTIONS
-- ============================================
CREATE TABLE questions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    exam_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    question_type ENUM('mcq', 'essay'),
    choices JSON,
    answer TEXT,
    points DECIMAL(5,2) NOT NULL,
    order_index INT,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);
CREATE INDEX idx_questions_exam ON questions(exam_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    sender_id CHAR(36) NOT NULL,
    recipient_id CHAR(36),
    class_id CHAR(36),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_class ON notifications(class_id);

-- ============================================
-- DISCUSSIONS
-- ============================================
-- Bảng 1: Thảo luận
CREATE TABLE discussions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    class_id CHAR(36) NOT NULL,
    author_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('active', 'resolved') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
-- Bảng 2: Bình luận cấp 1
CREATE TABLE discussion_comments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    discussion_id CHAR(36) NOT NULL,
    author_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Khóa ngoại
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tối ưu truy vấn
CREATE INDEX idx_discussion_comments_discussion ON discussion_comments(discussion_id);

-- Bảng 3: Phản hồi cấp 2

CREATE TABLE discussion_replies (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    comment_id CHAR(36) NOT NULL,
    author_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES discussion_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_discussion_replies_comment ON discussion_replies(comment_id);

-- mối quan hệ discussions (1) ────< (n) discussion_comments (1) ────< (n) discussion_replies

-- ============================================
-- REQUESTS
-- ============================================
CREATE TABLE requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id CHAR(36) NOT NULL,
    type ENUM('certificate', 'leave', 'financial_aid', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by CHAR(36),
    response TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id)
);
CREATE INDEX idx_requests_student ON requests(student_id);
CREATE INDEX idx_requests_status ON requests(status);
