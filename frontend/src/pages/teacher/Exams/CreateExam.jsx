import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Select, DatePicker, InputNumber, 
  message, Card, Typography, Space, Radio, Divider, Row, Col, Collapse 
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import examApi from '@/api/examApi';
import { getMyClasses } from '@/api/ClassApi';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const questionTypes = [
  { value: 'multiple_choice', label: 'Trắc nghiệm' },
  { value: 'essay', label: 'Tự luận' },
];

const initialQuestion = {
  question_type: 'multiple_choice',
  content: '',
  options: [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
  ],
  correct_answer: 'A',
  max_score: 1
};

const CreateExam = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(undefined);
  const [questions, setQuestions] = useState([{ ...initialQuestion }]);

  // Lấy danh sách lớp học
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getMyClasses();
        let classesData = Array.isArray(response?.data) ? response.data : [];

        classesData = classesData.map(cls => ({
          ...cls,
          course_title: cls.course_id?.title || `Lớp ${cls._id}`
        }));

        setClasses(classesData);

        if (classesData.length > 0 && !selectedClass) {
          setSelectedClass(classesData[0]._id);
          form.setFieldsValue({ class_id: classesData[0]._id });
        }
      } catch (error) {
        message.error('Không thể tải danh sách lớp học');
        setClasses([]);
      } finally {
        setClassLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const addQuestion = (type = 'multiple_choice') => {
    const newQuestion = {
        ...JSON.parse(JSON.stringify(initialQuestion)),
        question_type: type,
        options: type === 'multiple_choice' 
        ? initialQuestion.options.map(opt => ({ ...opt })) 
        : []
    };
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    };

  const removeQuestion = (index) => {
    if (questions.length <= 1) {
      message.warning('Phải có ít nhất một câu hỏi');
      return;
    }
    setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex].text = value;
    setQuestions(newQuestions);
  };

  const calculateTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.max_score || 1), 0);
  };

  const onFinish = async (values) => {
    try {
      if (questions.length === 0) {
        message.error('Vui lòng thêm ít nhất một câu hỏi');
        return;
      }

      // Validate questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.content) {
          message.error(`Vui lòng nhập nội dung câu hỏi ${i + 1}`);
          return;
        }
        
        if (q.question_type === 'multiple_choice') {
          if (!q.correct_answer) {
            message.error(`Vui lòng chọn đáp án đúng cho câu hỏi ${i + 1}`);
            return;
          }
          
          // Check if all options have text
          const emptyOption = q.options.find(opt => !opt.text.trim());
          if (emptyOption) {
            message.error(`Vui lòng điền đầy đủ các đáp án cho câu hỏi ${i + 1}`);
            return;
          }
        }
      }

      setLoading(true);
      
      const examData = {
        ...values,
        class_id: selectedClass,
        start_time: values.start_time.toISOString(),
        total_points: calculateTotalPoints(),
        questions: questions.map(q => {
          const question = {
            question_type: q.question_type,
            content: q.content,
            max_score: q.max_score,
            order: q.order || 1
          };

          if (q.question_type === 'multiple_choice') {
            question.options = q.options.map(opt => ({
              id: opt.id,
              text: opt.text
            }));
            question.correct_answer = q.correct_answer;
          } else {
            // For essay questions, ensure these fields are not included
            question.options = [];
            question.correct_answer = '';
          }
          
          return question;
        })
      };

      console.log('Sending exam data:', JSON.stringify(examData, null, 2));
      
      const response = await examApi.create(examData);
      console.log('Exam created successfully:', response);
      message.success('Tạo bài kiểm tra thành công');
      navigate('/teacher/exams');
    } catch (error) {
      message.error('Lỗi khi tạo bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question, index) => {
    const isMultipleChoice = question.question_type === 'multiple_choice';
    
    return (
      <div key={index} className="mb-6 p-4 border rounded">
        <div className="flex justify-between items-center mb-4">
          <Text strong>Câu hỏi {index + 1}: {isMultipleChoice ? 'Trắc nghiệm' : 'Tự luận'}</Text>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              removeQuestion(index);
            }}
            className="delete-question-btn"
          />
        </div>
        
        <Form.Item
          label="Loại câu hỏi"
          className="mb-3"
        >
          <Radio.Group
            value={question.question_type}
            onChange={(e) => updateQuestion(index, 'question_type', e.target.value)}
            buttonStyle="solid"
          >
            {questionTypes.map(type => (
              <Radio.Button key={type.value} value={type.value}>
                {type.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Nội dung câu hỏi"
          required
          className="mb-3"
        >
          <Input.TextArea
            rows={3}
            placeholder="Nhập nội dung câu hỏi..."
            value={question.content}
            onChange={(e) => updateQuestion(index, 'content', e.target.value)}
          />
        </Form.Item>

        {isMultipleChoice && (
          <div className="mb-4">
            <Text strong className="block mb-2">Đáp án:</Text>
            <Space direction="vertical" className="w-full">
              {question.options.map((option, optIndex) => (
                <div key={option.id} className="flex items-center">
                  <div className="w-6 font-medium">{option.id}.</div>
                  <Input
                    placeholder={`Đáp án ${option.id}`}
                    value={option.text}
                    onChange={(e) => updateOption(index, optIndex, e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
            </Space>
            
            <Form.Item label="Đáp án đúng" className="mt-3 mb-0">
              <Radio.Group
                value={question.correct_answer}
                onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
              >
                <Row gutter={[16, 8]}>
                  {question.options.map(opt => (
                    <Col span={6} key={opt.id}>
                      <Radio value={opt.id}>{opt.id}</Radio>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            </Form.Item>
          </div>
        )}

        <Form.Item label="Điểm tối đa" className="mb-0">
          <InputNumber
            min={0.5}
            step={0.5}
            value={question.max_score}
            onChange={(value) => updateQuestion(index, 'max_score', value)}
          />
        </Form.Item>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Title level={2}>Tạo bài kiểm tra mới</Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            duration_minutes: 60,
          }}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề bài kiểm tra" />
          </Form.Item>

          <Form.Item
            label="Lớp học"
            name="class_id"
            rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
          >
            <Select
              placeholder={classLoading ? 'Đang tải...' : 'Chọn lớp học'}
              style={{ width: '100%' }}
              value={selectedClass}
              onChange={(value) => {
                setSelectedClass(value);
                form.setFieldsValue({ class_id: value });
              }}
              loading={classLoading}
              disabled={classLoading}
              getPopupContainer={trigger => trigger.parentNode}
              allowClear={false}
            >
              {Array.isArray(classes) && classes.length > 0 ? (
                classes.map(cls => (
                  <Option key={cls._id} value={cls._id}>
                    {cls.course_title} - {cls.schedule}
                  </Option>
                ))
              ) : (
                <Option disabled>Không có lớp học nào</Option>
              )}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời gian bắt đầu"
                name="start_time"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    return current && current < moment().startOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thời gian làm bài (phút)"
                name="duration_minutes"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian làm bài' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text strong>Câu hỏi</Text>
            <Text type="secondary" className="ml-2">
              (Tổng điểm: {calculateTotalPoints()} điểm)
            </Text>
          </Divider>

          <div className="space-y-4 mb-4">
            {questions.map((question, index) => renderQuestion(question, index))}
          </div>

          <div className="flex space-x-2 mb-6">
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={() => addQuestion('multiple_choice')}
            >
              Thêm câu trắc nghiệm
            </Button>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />}
              onClick={() => addQuestion('essay')}
            >
              Thêm câu tự luận
            </Button>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo bài kiểm tra
              </Button>
              <Button onClick={() => navigate('/teacher/exams')}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateExam;
