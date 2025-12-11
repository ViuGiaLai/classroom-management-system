import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Space, message, Modal, Tag, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import examApi from '../../../api/examApi';
import moment from 'moment';

const { Search } = Input;

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Lấy danh sách bài kiểm tra
  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examApi.getAll();
      setExams(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách bài kiểm tra');
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Xử lý xóa bài kiểm tra
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await examApi.delete(id);
      message.success('Xóa bài kiểm tra thành công');
      await fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa bài kiểm tra';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Lọc bài kiểm tra theo từ khóa tìm kiếm
  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchText.toLowerCase()) ||
      exam.class_id?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Định dạng cột cho bảng
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/teacher/exams/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: 'Lớp học',
      dataIndex: ['class_id', 'name'],
      key: 'class',
    },
    {
      title: 'Thời gian',
      dataIndex: 'start_time',
      key: 'time',
      render: (time) => moment(time).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration_minutes',
      key: 'duration',
      render: (duration) => `${duration} phút`,
    },
    {
      title: 'Điểm',
      dataIndex: 'total_points',
      key: 'points',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const now = new Date();
        const startTime = new Date(record.start_time);
        const endTime = new Date(startTime.getTime() + record.duration_minutes * 60000);
        
        if (now < startTime) {
          return <Tag color="blue">Chưa bắt đầu</Tag>;
        } else if (now >= startTime && now <= endTime) {
          return <Tag color="green">Đang diễn ra</Tag>;
        } else {
          return <Tag color="red">Đã kết thúc</Tag>;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/teacher/exams/${record._id}`}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
          <Link to={`/teacher/exams/edit/${record._id}`}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài kiểm tra này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ loading: loading }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              loading={loading}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý Bài kiểm tra</h2>
        <Link to="/teacher/exams/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo bài kiểm tra
          </Button>
        </Link>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input 
            placeholder="Tìm kiếm bài kiểm tra..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Button type="primary" icon={<SearchOutlined />} />
        </Space.Compact>
      </div>

      <Table
        columns={columns}
        dataSource={filteredExams}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ExamManagement;
