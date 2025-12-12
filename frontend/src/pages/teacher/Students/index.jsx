import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, Button, Table, Tag, Empty } from 'antd';
import { getStudentsInClass, getMyStudents } from '@/api/ClassApi';
import { getCourseClassById } from '@/api/ClassApi';

const TeacherStudents = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [classInfo, setClassInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (classId) {
            fetchClassInfo();
            fetchStudents();
        } else {
            fetchAllStudents();
        }
    }, [classId]);

    const fetchClassInfo = async () => {
        try {
            const response = await getCourseClassById(classId);
            setClassInfo(response.data);
        } catch (error) {
            console.error('Error fetching class info:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const response = await getStudentsInClass(classId);
            const studentsList = Array.isArray(response) ? response : [];
            setStudents(studentsList);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Không thể tải danh sách sinh viên');
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllStudents = async () => {
    try {
        setIsLoading(true);
        const response = await getMyStudents();
        
        // In ra để debug
        console.log('Raw API response:', response);

        let studentsList = [];
        if (Array.isArray(response)) {
            studentsList = response;
        } else if (response && Array.isArray(response.data)) {
            studentsList = response.data;
        } else if (response && response.count > 0) {
            studentsList = response.data || [];
        }

        console.log('Final students list:', studentsList);
        setStudents(studentsList);
        
        if (studentsList.length === 0) {
            toast.info("Chưa có sinh viên nào được điểm danh trong các lớp của bạn");
        }
    } catch (error) {
        console.error('Error fetching my students:', error);
        toast.error('Lỗi tải danh sách sinh viên');
        setStudents([]);
    } finally {
        setIsLoading(false);
    }
};

    const getStatusColor = (status) => {
        const statusMap = {
            'Đang học': 'green',
            'Tạm nghỉ': 'orange',
            'Đã tốt nghiệp': 'blue',
            'Đã thôi học': 'red',
        };
        return statusMap[status] || 'default';
    };

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
            width: 120,
        },
        {
            title: 'Họ và tên',
            key: 'full_name',
            render: (_, record) => {
                const name = record.user_id?.full_name || record.full_name || 'Chưa có tên';
                return <span className="font-medium">{name}</span>;
            },
            width: 200,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status || 'Đang học'}
                </Tag>
            ),
            width: 120,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 mr-2 animate-spin" />
                <span>Đang tải danh sách sinh viên...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Button
                    icon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => navigate('/teacher/classes')}
                    className="mb-4"
                >
                    Quay lại
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {classId ? 'Danh sách sinh viên' : 'Tất cả sinh viên của tôi'}
                </h1>
                {classInfo && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Lớp học:</span> {classInfo.course_id?.title || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Mã lớp:</span> {classInfo.course_id?.code || 'N/A'}
                        </p>
                    </div>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    Tổng số sinh viên: {students.length}
                </p>
            </div>

            {students.length === 0 ? (
                <Empty
                    description={classId ? "Lớp học này chưa có sinh viên nào" : "Bạn chưa có sinh viên nào trong các lớp học"}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <Card>
                    <Table
                        columns={columns}
                        dataSource={students}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} sinh viên`,
                        }}
                    />
                </Card>
            )}
        </div>
    );
};

export default TeacherStudents;
