import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form, Input, Button, Select, DatePicker, InputNumber,
    message, Card, Typography, Space, List, Radio, Modal
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import examApi from '@/api/examApi';
import { getCourseClasses } from '@/api/ClassApi';

const { Title } = Typography;
const { Option } = Select;

const EditExam = () => {
    const [form] = Form.useForm();
    const [questionForm] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]); // Danh sách câu hỏi đã chỉnh sửa

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null); // null = thêm mới, có index = đang sửa
    const [questionType, setQuestionType] = useState('multiple_choice');

    // Tải dữ liệu ban đầu
    useEffect(() => {
        const loadData = async () => {
            try {
                const [classesRes, examRes] = await Promise.all([
                    getCourseClasses(),
                    examApi.getById(id)
                ]);

                setClasses(classesRes.data || []);
                const examData = examRes.data;
                setExam(examData);

                // Chuyển đổi questions từ backend về dạng dễ dùng trong form
                const mappedQuestions = (examData.questions || []).map(q => ({
                    questionText: q.content,
                    type: q.question_type,
                    points: q.max_score,
                    // Trắc nghiệm: chuyển options + correct_answer thành dạng dễ chọn
                    ...(q.question_type === 'multiple_choice' && {
                        options: q.options.map((text, idx) => ({
                            text,
                            value: String.fromCharCode(65 + idx) // A, B, C...
                        })),
                        correctAnswer: q.options.indexOf(q.correct_answer) // index của đáp án đúng
                    })
                }));

                setQuestions(mappedQuestions);

                form.setFieldsValue({
                    ...examData,
                    start_time: moment(examData.start_time)
                });
            } catch (err) {
                message.error('Không tải được dữ liệu bài kiểm tra');
                console.error(err);
            }
        };

        loadData();
    }, [id, form]);

    // --- Quản lý câu hỏi ---
    const openQuestionModal = (question = null, index = null) => {
        setEditingQuestion(question ? { ...question, index } : null);
        setQuestionType(question?.type || 'multiple_choice');
        questionForm.resetFields();

        if (question) {
            questionForm.setFieldsValue({
                questionText: question.questionText,
                points: question.points,
                ...(question.type === 'multiple_choice' && {
                    options: question.options,
                    correctAnswer: question.correctAnswer
                })
            });
        } else {
            questionForm.setFieldsValue({ points: 1 });
        }

        setIsModalOpen(true);
    };

    const closeQuestionModal = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
        questionForm.resetFields();
    };

    const saveQuestion = (values) => {
        const newQuestion = {
            questionText: values.questionText,
            type: questionType,
            points: Number(values.points),
        };

        if (questionType === 'multiple_choice') {
            newQuestion.options = values.options.map(o => ({ text: o.text }));
            newQuestion.correctAnswer = values.correctAnswer;
        }

        const updatedQuestions = [...questions];
        if (editingQuestion !== null) {
            updatedQuestions[editingQuestion.index] = newQuestion;
        } else {
            updatedQuestions.push(newQuestion);
        }

        setQuestions(updatedQuestions);
        closeQuestionModal();
    };

    const deleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // --- Submit toàn bộ bài kiểm tra ---
    const onSubmitExam = async (values) => {
        setLoading(true);
        try {
            // Chuyển questions về đúng format API yêu cầu
            const apiQuestions = questions.map((q, index) => ({
                content: q.questionText,
                question_type: q.type,
                max_score: q.points,
                order: index + 1,
                ...(q.type === 'multiple_choice' && {
                    options: q.options.map(o => o.text),
                    correct_answer: q.options[q.correctAnswer]?.text
                })
            }));

            await examApi.update(id, {
                ...values,
                start_time: values.start_time.toDate(),
                questions: apiQuestions
            });

            message.success('Cập nhật bài kiểm tra thành công!');
            navigate(`/teacher/exams/${id}`);
        } catch (err) {
            message.error('Cập nhật thất bại');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current) => current && current < moment().startOf('day');
    const goBack = () => navigate(-1);

    if (!exam) return <div style={{ textAlign: 'center', padding: 50 }}>Đang tải...</div>;

    return (
        <div style={{ margin: '0 auto', padding: '24px 16px' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={goBack} style={{ marginBottom: 16 }}>
                Quay lại
            </Button>

            <Card>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                    Chỉnh sửa bài kiểm tra
                </Title>

                <Form form={form} layout="vertical" onFinish={onSubmitExam}>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                        <Input placeholder="Kiểm tra 45 phút - Chương 1" />
                    </Form.Item>

                    <Form.Item name="class_id" label="Lớp học" rules={[{ required: true }]}>
                        <Select placeholder="Chọn lớp" showSearch>
                            {classes.map(cls => (
                                <Option key={cls._id} value={cls._id}>
                                    {cls.course_id?.title || cls.name}{cls.schedule && ` - ${cls.schedule}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="start_time" label="Thời gian bắt đầu" rules={[{ required: true }]}>
                        <DatePicker showTime format="DD/MM/YYYY HH:mm" disabledDate={disabledDate} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="duration_minutes" label="Thời lượng (phút)" rules={[{ required: true }]}>
                        <InputNumber min={1} max={300} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="total_points" label="Tổng điểm" rules={[{ required: true }]}>
                        <InputNumber min={1} max={1000} style={{ width: '100%' }} />
                    </Form.Item>

                    {/* Danh sách câu hỏi */}
                    <Form.Item label="Câu hỏi">
                        <Button type="dashed" onClick={() => openQuestionModal()} icon={<PlusOutlined />} block style={{ marginBottom: 16 }}>
                            Thêm câu hỏi
                        </Button>

                        <List
                            dataSource={questions}
                            renderItem={(q, idx) => (
                                <List.Item
                                    actions={[
                                        <Button type="link" onClick={() => openQuestionModal(q, idx)}>Sửa</Button>,
                                        <Button type="text" danger onClick={() => deleteQuestion(idx)}>Xóa</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={`Câu ${idx + 1}: ${q.questionText || '(trống)'}`}
                                        description={`${q.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'} • ${q.points} điểm`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả (không bắt buộc)">
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Lưu thay đổi
                            </Button>
                            <Button onClick={goBack}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            {/* Modal thêm/sửa câu hỏi */}
            <Modal
                title={editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
                open={isModalOpen}
                onCancel={closeQuestionModal}
                footer={null}
                width={700}
            >
                <Form form={questionForm} layout="vertical" onFinish={saveQuestion}>
                    <Form.Item label="Loại câu hỏi">
                        <Radio.Group value={questionType} onChange={e => setQuestionType(e.target.value)}>
                            <Radio value="multiple_choice">Trắc nghiệm</Radio>
                            <Radio value="essay">Tự luận</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="questionText" label="Nội dung câu hỏi" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    {questionType === 'multiple_choice' && (
                        <>
                            <Form.List name="options" rules={[{ required: true, message: 'Cần ít nhất 2 lựa chọn' }]}>
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'text']}
                                                    rules={[{ required: true, message: 'Nhập nội dung' }]}
                                                >
                                                    <Input placeholder={`Lựa chọn ${name + 1}`} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm lựa chọn
                                        </Button>
                                    </>
                                )}
                            </Form.List>

                            <Form.Item name="correctAnswer" label="Đáp án đúng" rules={[{ required: true }]}>
                                <Radio.Group>
                                    {questionForm.getFieldValue('options')?.map((opt, idx) => (
                                        <Radio key={idx} value={idx}>
                                            {opt?.text || `Lựa chọn ${idx + 1}`}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        </>
                    )}

                    <Form.Item name="points" label="Điểm số" initialValue={1} rules={[{ required: true }]}>
                        <InputNumber min={0.5} step={0.5} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingQuestion ? 'Cập nhật' : 'Thêm'}
                            </Button>
                            <Button onClick={closeQuestionModal}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EditExam;