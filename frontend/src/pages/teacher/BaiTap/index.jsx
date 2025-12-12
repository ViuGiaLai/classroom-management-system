import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    Select,
    DatePicker,
    InputNumber,
    message,
    Card,
    Row,
    Col,
    Divider,
    Checkbox,
    Spin,
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import {
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
} from '@/api/assignmentApi';
import { getMyClasses } from '@/api/ClassApi';
import { useAuth } from '@/hooks/useAuth';

const { Option } = Select;
const { TextArea } = Input;

const AssignmentManagement = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();

    // State chính
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [searchText, setSearchText] = useState('');

    // Modal & form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [viewingAssignment, setViewingAssignment] = useState(null);

    // Câu hỏi
    const [questionType, setQuestionType] = useState('essay');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);

    const [deletingId, setDeletingId] = useState(null);

    // Lấy danh sách lớp học
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await getMyClasses();
                const classList = Array.isArray(res?.data) ? res.data : [];

                const formatted = classList.map((cls) => ({
                    ...cls,
                    course_title: cls.course_id?.title || `Lớp ${cls._id}`,
                }));

                setClasses(formatted);
                if (formatted.length > 0 && !selectedClass) {
                    setSelectedClass(formatted[0]._id);
                }
            } catch (err) {
                message.error('Không thể tải danh sách lớp học');
                setClasses([]);
            } finally {
                setLoadingClasses(false);
            }
        };

        fetchClasses();
    }, []);

    // Lấy bài tập khi chọn lớp
    useEffect(() => {
        if (selectedClass) {
            fetchAssignments(selectedClass);
        }
    }, [selectedClass]);

    const fetchAssignments = async (classId) => {
        if (!classId) return;
        setLoading(true);
        try {
            const data = await getAssignments(classId);
            setAssignments(data || []);
        } catch (err) {
            message.error('Lỗi khi tải danh sách bài tập');
        } finally {
            setLoading(false);
        }
    };

    // Tìm kiếm
    const filteredAssignments = assignments.filter(
        (item) =>
            item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.class?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Mở modal tạo mới
    const openCreateModal = () => {
        if (!selectedClass) {
            message.warning('Vui lòng chọn lớp học trước');
            return;
        }

        setEditingAssignment(null);
        form.resetFields();
        form.setFieldsValue({
            class: selectedClass,
            type: 'essay',
            dueDate: dayjs().add(7, 'day'),
            status: 'active',
        });
        setQuestionType('essay');
        setQuestions([]);
        setCurrentQuestion('');
        setCurrentOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setIsModalOpen(true);
    };

    // Mở modal chỉnh sửa
    const openEditModal = async (record) => {
        try {
            setModalLoading(true);
            const data = await getAssignmentById(record.id);

            setEditingAssignment(data);
            setQuestionType(data.type);
            setQuestions(data.questions || []);

            form.setFieldsValue({
                title: data.title,
                class: data.classId,
                description: data.description,
                dueDate: dayjs(data.dueDate),
                totalScore: data.totalScore,
                type: data.type,
                status: data.status || 'active',
            });

            setIsModalOpen(true);
        } catch (err) {
            message.error('Không thể tải thông tin bài tập');
        } finally {
            setModalLoading(false);
        }
    };

    // Thêm câu hỏi
    const addQuestion = () => {
        if (!currentQuestion.trim()) {
            message.warning('Vui lòng nhập nội dung câu hỏi');
            return;
        }

        if (questionType === 'multiple_choice') {
            if (currentOptions.some((opt) => !opt.trim())) {
                message.warning('Vui lòng điền đầy đủ các lựa chọn');
                return;
            }
        }

        const newQuestion = {
            id: Date.now(),
            question: currentQuestion,
            type: questionType,
            options: questionType === 'multiple_choice' ? currentOptions : undefined,
            correctAnswer: questionType === 'multiple_choice' ? correctAnswer : undefined,
            points: 1,
        };

        setQuestions([...questions, newQuestion]);
        setCurrentQuestion('');
        setCurrentOptions(['', '', '', '']);
        setCorrectAnswer(0);
    };

    // Xóa câu hỏi
    const removeQuestion = (id) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    // Lưu / Cập nhật bài tập
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (questions.length === 0) {
                message.warning('Vui lòng thêm ít nhất một câu hỏi');
                return;
            }

            const payload = {
                ...values,
                classId: values.class,
                dueDate: values.dueDate.toISOString(),
                type: questionType,
                questions,
                organization_id: user?.organization_id,
                status: values.status || 'active',
            };

            setModalLoading(true);

            if (editingAssignment) {
                await updateAssignment(editingAssignment._id, payload);
                message.success('Cập nhật bài tập thành công');
            } else {
                await createAssignment(payload);
                message.success('Tạo bài tập thành công');
            }

            setIsModalOpen(false);
            fetchAssignments(selectedClass);
        } catch (err) {
            message.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setModalLoading(false);
        }
    };

    // Xóa bài tập
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa bài tập này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () => {
                setDeletingId(id);
                try {
                    await deleteAssignment(id);
                    message.success('Xóa bài tập thành công');
                    fetchAssignments(selectedClass);
                } catch (err) {
                    message.error('Xóa thất bại');
                } finally {
                    setDeletingId(null);
                }
            },
        });
    };

    // Cột bảng
    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        {
            title: 'Hạn nộp',
            dataIndex: 'dueDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        { title: 'Điểm', dataIndex: 'totalScore' },
        {
            title: 'Loại',
            dataIndex: 'type',
            render: (t) => (t === 'essay' ? 'Tự luận' : 'Trắc nghiệm'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (s) => (
                <span style={{ color: s === 'active' ? 'green' : 'red' }}>
                    {s === 'active' ? 'Đang mở' : 'Đã đóng'}
                </span>
            ),
        },
        {
            title: 'Đã nộp',
            render: (_, r) => `${r.submittedCount || 0}/${r.totalStudents || 0}`,
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setViewingAssignment(record);
                            setIsDetailModalOpen(true);
                        }}
                    />
                    <Button type="primary" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        loading={deletingId === record.id}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Quản lý bài tập</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} disabled={!selectedClass}>
                    Tạo bài tập mới
                </Button>
            </div>

            {/* Lọc lớp + tìm kiếm */}
            <Space style={{ marginBottom: 16 }} size="large">
                <Select
                    loading={loadingClasses}
                    placeholder="Chọn lớp học"
                    style={{ width: 400 }}
                    value={selectedClass}
                    onChange={setSelectedClass}
                >
                    {classes.map((cls) => (
                        <Option key={cls._id} value={cls._id}>
                            {cls.course_title} - {cls.schedule || ''}
                        </Option>
                    ))}
                </Select>

                <Input
                    placeholder="Tìm kiếm bài tập..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </Space>

            {/* Bảng danh sách */}
            {selectedClass ? (
                <Table
                    columns={columns}
                    dataSource={filteredAssignments}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Không có bài tập nào' }}
                />
            ) : (
                <Card style={{ textAlign: 'center' }}>
                    <p>Vui lòng chọn lớp học để xem danh sách bài tập</p>
                </Card>
            )}

            {/* Modal chi tiết */}
            <Modal
                title="Chi tiết bài tập"
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={null}
            >
                {viewingAssignment && (
                    <>
                        <p><strong>Tiêu đề:</strong> {viewingAssignment.title}</p>
                        <p><strong>Mô tả:</strong> {viewingAssignment.description || 'Không có'}</p>
                        <p><strong>Hạn nộp:</strong> {dayjs(viewingAssignment.dueDate).format('DD/MM/YYYY HH:mm')}</p>
                        <p><strong>Điểm tối đa:</strong> {viewingAssignment.totalScore}</p>

                        <Divider> Câu hỏi </Divider>
                        {viewingAssignment.questions?.map((q, i) => (
                            <div key={i} style={{ marginBottom: 16 }}>
                                <p><strong>Câu {i + 1}:</strong> {q.question}</p>
                                {q.type === 'multiple_choice' && q.options && (
                                    <div style={{ marginLeft: 20 }}>
                                        {q.options.map((opt, idx) => (
                                            <p
                                                key={idx}
                                                style={{
                                                    color: q.correctAnswer === idx ? 'green' : 'inherit',
                                                    fontWeight: q.correctAnswer === idx ? 'bold' : 'normal',
                                                }}
                                            >
                                                {String.fromCharCode(65 + idx)}. {opt}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </Modal>

            {/* Modal tạo/sửa */}
            <Modal
                title={editingAssignment ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
                open={isModalOpen}
                onCancel={() => !modalLoading && setIsModalOpen(false)}
                width={900}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)} disabled={modalLoading}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={modalLoading}
                        onClick={handleSubmit}
                        disabled={questions.length === 0}
                    >
                        {editingAssignment ? 'Cập nhật' : 'Tạo mới'}
                    </Button>,
                ]}
            >
                <Spin spinning={modalLoading}>
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="class" label="Lớp học" rules={[{ required: true }]}>
                                    <Select disabled={!!editingAssignment}>
                                        {classes.map((c) => (
                                            <Option key={c._id} value={c._id}>
                                                {c.course_title}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="type" label="Loại bài" rules={[{ required: true }]}>
                                    <Select onChange={setQuestionType}>
                                        <Option value="essay">Tự luận</Option>
                                        <Option value="multiple_choice">Trắc nghiệm</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="active">Đang mở</Option>
                                        <Option value="inactive">Đã đóng</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="totalScore" label="Điểm tối đa" rules={[{ required: true }]}>
                                    <InputNumber min={1} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="dueDate" label="Hạn nộp" rules={[{ required: true }]}>
                            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item name="description" label="Mô tả">
                            <TextArea rows={3} />
                        </Form.Item>

                        <Divider>Câu hỏi</Divider>

                        {/* Danh sách câu hỏi đã thêm */}
                        {questions.map((q, idx) => (
                            <Card
                                key={q.id}
                                size="small"
                                title={`Câu ${idx + 1}`}
                                style={{ marginBottom: 12 }}
                                extra={
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeQuestion(q.id)} />
                                }
                            >
                                <p>{q.question}</p>
                                {q.type === 'multiple_choice' && q.options && (
                                    <div>
                                        {q.options.map((opt, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    color: q.correctAnswer === i ? 'green' : undefined,
                                                    fontWeight: q.correctAnswer === i ? 'bold' : 'normal',
                                                }}
                                            >
                                                {String.fromCharCode(65 + i)}. {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}

                        {/* Form thêm câu hỏi mới */}
                        <Card size="small" style={{ marginTop: 16 }}>
                            <TextArea
                                value={currentQuestion}
                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                placeholder="Nhập câu hỏi..."
                                rows={2}
                                style={{ marginBottom: 12 }}
                            />

                            {questionType === 'multiple_choice' && (
                                <Space direction="vertical" style={{ width: '100%', marginBottom: 12 }}>
                                    {currentOptions.map((opt, i) => (
                                        <Space key={i}>
                                            <Checkbox
                                                checked={correctAnswer === i}
                                                onChange={() => setCorrectAnswer(i)}
                                            />
                                            <Input
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...currentOptions];
                                                    newOpts[i] = e.target.value;
                                                    setCurrentOptions(newOpts);
                                                }}
                                                placeholder={`Lựa chọn ${String.fromCharCode(65 + i)}`}
                                            />
                                        </Space>
                                    ))}
                                </Space>
                            )}

                            <Button type="dashed" block icon={<PlusOutlined />} onClick={addQuestion}>
                                Thêm câu hỏi này
                            </Button>
                        </Card>
                    </Form>
                </Spin>
            </Modal>
        </div>
    );
};

export default AssignmentManagement;