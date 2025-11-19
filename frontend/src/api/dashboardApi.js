import api from './axiosConfig';
import { getAllUsers } from './userApi';
import { getFaculties } from './facultyApi';
import { getCourses } from './courseApi';
import { getCourseClasses } from './ClassApi';

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const [usersResponse, facultiesResponse, coursesResponse, classesResponse] = await Promise.all([
      getAllUsers(),
      getFaculties(),
      getCourses(),
      getCourseClasses()
    ]);

    const users = usersResponse.data || [];
    const faculties = facultiesResponse.data || [];
    const courses = coursesResponse.data || [];
    const classes = classesResponse.data || [];

    // Count users by role
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const studentsCount = usersByRole.student || 0;
    const teachersCount = usersByRole.teacher || 0;
    const adminsCount = usersByRole.admin || 0;
    const totalUsers = users.length;

    // Calculate statistics
    const teacherStudentRatio = teachersCount > 0 ? `1:${Math.round(studentsCount / teachersCount)}` : '1:0';
    const avgClassesPerTeacher = teachersCount > 0 ? (classes.length / teachersCount).toFixed(1) : '0';
    const avgStudentsPerClass = classes.length > 0 ? Math.round(studentsCount / classes.length) : 0;

    // Count active faculties and courses
    const activeFaculties = faculties.filter(f => f.status === 'active' || !f.status).length;
    const activeCourses = courses.filter(c => c.status === 'active' || !c.status).length;
    const activeClasses = classes.filter(c => c.status === 'active' || !c.status).length;

    return {
      users: {
        total: totalUsers,
        students: studentsCount,
        teachers: teachersCount,
        admins: adminsCount,
        subtitle: `${teachersCount} giáo viên, ${studentsCount} sinh viên`
      },
      courses: {
        total: activeCourses,
        subtitle: 'Đang hoạt động'
      },
      classes: {
        total: activeClasses,
        subtitle: 'Học kỳ hiện tại'
      },
      faculties: {
        total: activeFaculties,
        subtitle: 'Đang hoạt động'
      },
      statistics: [
        {
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
          label: "Tỷ lệ giáo viên/sinh viên",
          value: teacherStudentRatio
        },
        {
          icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          label: "Số lớp trung bình/giáo viên",
          value: avgClassesPerTeacher
        },
        {
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          label: "Số sinh viên trung bình/lớp",
          value: avgStudentsPerClass
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get recent activities (this would need a backend endpoint)
export const getRecentActivities = async () => {
  try {
    // For now, return mock data - this should be replaced with a real API call
    // Backend should create an endpoint to log and retrieve recent activities
    const mockActivities = [
      {
        color: "bg-blue-500",
        title: "Tạo học phần mới",
        desc: "Cơ sở dữ liệu",
        time: "2 giờ trước"
      },
      {
        color: "bg-emerald-500",
        title: "Thêm giáo viên mới",
        desc: "Nguyễn Văn A",
        time: "5 giờ trước"
      },
      {
        color: "bg-purple-500",
        title: "Cập nhật thông tin khoa CNTT",
        desc: "",
        time: "1 ngày trước"
      }
    ];
    
    return mockActivities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getRecentActivities
};
