import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Typography,
    Descriptions,
    Tag,
    Space,
    List,
    message,
    Spin,
    Empty,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import examApi from '@/api/examApi';
import { getMyClasses } from '@/api/ClassApi';

const { Title } = Typography;

const ExamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lấy dữ liệu khi vào trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await examApi.getById(id);
                const examData = res.data;

                setExam(examData);

                // Xử lý danh sách câu hỏi
                if (examData.questions && examData.questions.length > 0) {
                    setQuestions(examData.questions);
                }

                // Lấy thông tin lớp học nếu có class_id
                if (examData.class_id) {
                    try {
                        const classRes = await getMyClasses();
                        const classes = Array.isArray(classRes) ? classRes : classRes?.data || [];
                        const found = classes.find((c) => c._id === examData.class_id);
                        if (found) setClassInfo(found);
                    } catch (err) {
                        console.error('Lỗi khi lấy thông tin lớp:', err);
                    }
                }
            } catch (error) {
                message.error('Không thể tải thông tin bài kiểm tra');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Hiển thị trạng thái bài kiểm tra
    const getStatusTag = (startTime, duration) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(start.getTime() + duration * 60 * 1000);

        if (now < start) return <Tag color="blue">Chưa bắt đầu</Tag>;
        if (now >= start && now <= end) return <Tag color="green">Đang diễn ra</Tag>;
        return <Tag color="red">Đã kết thúc</Tag>;
    };

    // Loading
    if (loading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }

    // Không tìm thấy
    if (!exam) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Empty description="Không tìm thấy bài kiểm tra" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', margin: '0 auto' }}>
            {/* Nút quay lại */}
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 20 }}
            >
                Quay lại
            </Button>

            {/* Card chính */}
            <Card
                title={
                    <Space>
                        <Title level={4} style={{ margin: 0 }}>
                            {exam.title}
                        </Title>
                        {getStatusTag(exam.start_time, exam.duration_minutes)}
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/teacher/exams/edit/${exam._id}`)}
                    >
                        Chỉnh sửa
                    </Button>
                }
            >
                <Descriptions bordered column={1} labelStyle={{ width: 160 }}>
                    <Descriptions.Item label="Lớp học">
                        {classInfo ? (
                            <>
                                {classInfo.course_id?.title || 'Chưa có tên môn học'}
                                {classInfo.schedule && ` - ${classInfo.schedule}`}
                            </>
                        ) : (
                            '—'
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Thời gian bắt đầu">
                        {moment(exam.start_time).format('HH:mm, ngày DD/MM/YYYY')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Thời lượng">
                        {exam.duration_minutes} phút
                    </Descriptions.Item>

                    <Descriptions.Item label="Tổng điểm">
                        <strong>{exam.total_points} điểm</strong>
                    </Descriptions.Item>

                    <Descriptions.Item label="Mô tả">
                        {exam.description || <span style={{ color: '#aaa' }}>Không có mô tả</span>}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Danh sách câu hỏi */}
            <div style={{ marginTop: 30 }}>
                <Title level={5}>Danh sách câu hỏi ({questions.length})</Title>

                {questions.length === 0 ? (
                    <Card style={{ textAlign: 'center', padding: 20, background: '#fafafa' }}>
                        <Empty description="Chưa có câu hỏi nào" />
                    </Card>
                ) : (
                    <List
                        bordered
                        dataSource={questions}
                        renderItem={(q, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <span>
                                            <strong>Câu {index + 1}:</strong>{' '}
                                            {q.content || 'Chưa có nội dung câu hỏi'}
                                        </span>
                                    }
                                    description={
                                        <>
                                            <Tag color={q.question_type === 'multiple_choice' ? 'geekblue' : 'orange'}>
                                                {q.question_type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                                            </Tag>
                                            <span style={{ marginLeft: 8 }}>
                                                <strong>{q.max_score || 0}</strong> điểm
                                            </span>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default ExamDetail;