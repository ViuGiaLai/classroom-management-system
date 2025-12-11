import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, BookOpen, Users, Calendar, UserCheck } from 'lucide-react';
import { Card, Button, Tag, Empty } from 'antd';
import { getMyClasses } from '@/api/ClassApi';
import { useAuth } from '@/hooks/useAuth';

const TeacherClasses = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setIsLoading(true);
            const response = await getMyClasses();
            console.log('Classes response:', response);
            const classesList = Array.isArray(response?.data) ? response.data : [];
            setClasses(classesList);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast.error('Không thể tải danh sách lớp học');
            setClasses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewStudents = (classId) => {
        navigate(`/teacher/students/${classId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang hoạt động':
                return 'green';
            case 'Tạm dừng':
                return 'orange';
            case 'Đã kết thúc':
                return 'default';
            default:
                return 'blue';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 mr-2 animate-spin" />
                <span>Đang tải danh sách lớp học...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Lớp học của tôi</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Quản lý và theo dõi các lớp học phần bạn đang giảng dạy
                </p>
            </div>

            {classes.length === 0 ? (
                <Empty
                    description="Bạn chưa có lớp học nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map((classItem) => (
                        <Card
                            key={classItem._id}
                            className="hover:shadow-lg transition-shadow"
                            actions={[
                                <Button
                                    key="students"
                                    type="primary"
                                    icon={<UserCheck className="w-4 h-4" />}
                                    onClick={() => handleViewStudents(classItem._id)}
                                    className="w-full"
                                >
                                    Xem sinh viên
                                </Button>
                            ]}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {classItem.course_id?.title || 'N/A'}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Mã lớp: {classItem.course_id?.code || 'N/A'}
                                        </p>
                                    </div>
                                    <Tag color={getStatusColor(classItem.status)}>
                                        {classItem.status || 'Đang hoạt động'}
                                    </Tag>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    {classItem.department_id && (
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{classItem.department_id.name}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {classItem.semester} - {classItem.year}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>
                                            {classItem.current_enrollment || 0} / {classItem.max_capacity || 40} sinh viên
                                        </span>
                                    </div>

                                    {classItem.schedule && (
                                        <div className="text-xs text-gray-500 mt-2">
                                            Lịch học: {classItem.schedule}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherClasses;

