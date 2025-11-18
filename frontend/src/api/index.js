// Xuất tất cả các hàm API để dễ dàng import
export { getFaculties, createFaculty, updateFaculty, deleteFaculty, getFacultyById } from './facultyApi';
export { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentById } from './departmentApi';
export { getTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherById } from './teacherApi';
export { getStudents, createStudent, updateStudent, deleteStudent, getStudentById } from './studentApi';
export { getMajors, createMajor, updateMajor, deleteMajor, getMajorById } from './majorApi';
export { getCourseClasses, createCourseClass, updateCourseClass, deleteCourseClass, getCourseClassById } from './ClassApi';
export { getCourses, createCourse, updateCourse, deleteCourse, getCourseById } from './courseApi';
export { createUser, getAllUsers, updateUser, deleteUser, getUserById, login, logout, getCurrentUser } from './userApi';
