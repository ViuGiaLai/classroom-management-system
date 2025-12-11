import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Space,
  Tag,
  Empty,
  Spin,
  Row,
  Col,
  message,
} from 'antd';
import {
  ArrowLeft,
  Download,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import dayjs from 'dayjs';
import { getStudentsInClass, getCourseClassById, getCourseClasses } from '@/api/ClassApi';
import {
  getAttendanceByClass,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from '@/api/attendanceApi';

const DiemDanh = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // State management
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(classId || null);
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch my classes on mount
  useEffect(() => {
    fetchMyClasses();
  }, []);

  // Fetch class info and students when selectedClassId changes
  useEffect(() => {
    if (selectedClassId) {
      fetchClassInfo();
      fetchStudents();
    }
  }, [selectedClassId]);

  // Fetch attendance records when date or classId changes
  useEffect(() => {
    if (selectedClassId && selectedDate) {
      fetchAttendance();
    }
  }, [selectedClassId, selectedDate]);

  const fetchMyClasses = async () => {
    try {
      setIsLoading(true);
      const response = await getCourseClasses();
      const classList = Array.isArray(response.data) ? response.data : [];
      setClasses(classList);

      // If classId from URL, use it; otherwise use first class
      if (!selectedClassId && classList.length > 0) {
        setSelectedClassId(classList[0]._id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Không thể tải danh sách lớp học');
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClassInfo = async () => {
    try {
      const response = await getCourseClassById(selectedClassId);
      setClassInfo(response.data);
    } catch (error) {
      console.error('Error fetching class info:', error);
      toast.error('Không thể tải thông tin lớp học');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getStudentsInClass(selectedClassId);
      const studentsList = Array.isArray(response) ? response : [];
      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Không thể tải danh sách sinh viên');
      setStudents([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const response = await getAttendanceByClass(selectedClassId, dateStr);
      const records = Array.isArray(response) ? response : [];
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceRecords([]);
    }
  };

  // Get attendance status for a student
  const getStudentAttendanceStatus = (studentId) => {
    const record = attendanceRecords.find(
      (r) => r.student_id?._id === studentId || r.student_id === studentId
    );
    return record?.status || null;
  };



  // Handle edit attendance
  const handleEditAttendance = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      status: record.status,
      note: record.note || '',
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateAttendance = async (values) => {
    try {
      setIsSaving(true);
      await updateAttendance(
        editingRecord._id,
        values.status,
        values.note || ''
      );
      message.success('Cập nhật điểm danh thành công');
      setIsEditModalVisible(false);
      editForm.resetFields();
      fetchAttendance();
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Lỗi khi cập nhật điểm danh');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete attendance
  const handleDeleteAttendance = (recordId) => {
    Modal.confirm({
      title: 'Xóa điểm danh',
      content: 'Bạn chắc chắn muốn xóa bản ghi điểm danh này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setIsSaving(true);
          await deleteAttendance(recordId);
          message.success('Xóa điểm danh thành công');
          fetchAttendance();
        } catch (error) {
          console.error('Error deleting attendance:', error);
          toast.error('Lỗi khi xóa điểm danh');
        } finally {
          setIsSaving(false);
        }
      },
    });
  };

  // Reset all attendance for the day
  const handleResetDay = () => {
    Modal.confirm({
      title: 'Xóa tất cả điểm danh',
      content: `Bạn chắc chắn muốn xóa tất cả điểm danh của ngày ${selectedDate.format(
        'DD/MM/YYYY'
      )}?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setIsSaving(true);
          for (const record of attendanceRecords) {
            await deleteAttendance(record._id);
          }
          message.success('Xóa tất cả điểm danh thành công');
          fetchAttendance();
        } catch (error) {
          console.error('Error resetting attendance:', error);
          toast.error('Lỗi khi xóa điểm danh');
        } finally {
          setIsSaving(false);
        }
      },
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      'Có mặt': 'green',
      'Muộn': 'orange',
      'Vắng': 'red',
    };
    return colorMap[status] || 'default';
  };

  // Get status badge
  const getStatusBadge = (studentId) => {
    const status = getStudentAttendanceStatus(studentId);
    if (!status) {
      return <Tag>Chưa điểm danh</Tag>;
    }
    return <Tag color={getStatusColor(status)}>{status}</Tag>;
  };

  // Statistics
  const presentCount = attendanceRecords.filter(
    (r) => r.status === 'Có mặt'
  ).length;
  const lateCount = attendanceRecords.filter((r) => r.status === 'Muộn').length;
  const absentCount = attendanceRecords.filter(
    (r) => r.status === 'Vắng'
  ).length;

  // Table columns for attendance table
  const attendanceColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã sinh viên',
      key: 'student_code',
      dataIndex: ['student_id', 'student_code'],
      width: 120,
    },
    {
      title: 'Họ và tên',
      key: 'full_name',
      render: (_, record) => record.student_id?.user_id?.full_name || 'N/A',
      width: 200,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
      render: (note) => note || '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => handleEditAttendance(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDeleteAttendance(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Table columns for student list
  const studentColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'student_code',
      key: 'student_code',
      width: 120,
    },
    {
      title: 'Họ và tên',
      key: 'full_name',
      render: (_, record) => record.user_id?.full_name || 'N/A',
      width: 200,
    },
    {
      title: 'Email',
      key: 'email',
      render: (_, record) => record.user_id?.email || 'N/A',
      width: 200,
    },
    {
      title: 'Trạng thái điểm danh',
      key: 'attendance_status',
      width: 150,
      render: (_, record) => getStatusBadge(record._id),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
        <span className="ml-2">Đang tải lớp học...</span>
      </div>
    );
  }

  if (!selectedClassId || classes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <Button
          type="text"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/teacher/classes')}
          className="mb-4"
        >
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Điểm danh</h1>
        <Card className="mt-6 shadow-sm">
          <Empty
            description="Bạn chưa có lớp học nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            onClick={() => navigate('/teacher/classes')}
            className="mt-4"
          >
            Quay lại danh sách lớp học
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/teacher/classes')}
          className="mb-4"
        >
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Điểm danh</h1>
        <p className="text-gray-600 mt-2">
          Quản lý điểm danh sinh viên trong các lớp học
        </p>
      </div>

      {classInfo && (
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <div>
                <p className="text-sm text-gray-600">Lớp học</p>
                <p className="text-lg font-semibold">
                  {classInfo.course_id?.title || 'N/A'}
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <p className="text-sm text-gray-600">Mã lớp</p>
                <p className="text-lg font-semibold">
                  {classInfo.course_id?.code || 'N/A'}
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Attendance Selection Section */}
      <Card className="mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Chọn lớp học và ngày điểm danh
        </h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form layout="vertical">
              <Form.Item label="Lớp học">
                <Select
                  value={selectedClassId}
                  onChange={setSelectedClassId}
                  options={classes.map((cls) => ({
                    label: cls.course_id?.title || 'N/A',
                    value: cls._id,
                  }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form layout="vertical">
              <Form.Item label="Ngày điểm danh">
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="flex items-end h-full">
              <Button
                danger
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={handleResetDay}
                block
                disabled={attendanceRecords.length === 0}
              >
                Xóa hết
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={8}>
          <Card className="bg-green-50 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-sm text-gray-600 mt-1">Có mặt</p>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card className="bg-orange-50 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{lateCount}</p>
              <p className="text-sm text-gray-600 mt-1">Muộn</p>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card className="bg-red-50 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-sm text-gray-600 mt-1">Vắng</p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Attendance List */}
      <Card title="Danh sách điểm danh" className="mb-6 shadow-sm">
        {attendanceRecords.length === 0 ? (
          <Empty
            description="Chưa có bản ghi điểm danh nào cho ngày này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={attendanceColumns}
            dataSource={attendanceRecords}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} bản ghi`,
            }}
            loading={isSaving}
          />
        )}
      </Card>

      {/* Export Report Button */}
      <Card className="shadow-sm mt-6">
        <div className="flex justify-end">
          <Button
            type="default"
            size="large"
            icon={<Download className="w-4 h-4" />}
          >
            Xuất báo cáo
          </Button>
        </div>
      </Card>

      {/* Edit Attendance Modal */}
      <Modal
        title="Cập nhật điểm danh"
        open={isEditModalVisible}
        onOk={() => editForm.submit()}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isSaving}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateAttendance}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              options={[
                { label: 'Có mặt', value: 'Có mặt' },
                { label: 'Muộn', value: 'Muộn' },
                { label: 'Vắng', value: 'Vắng' },
              ]}
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm (tuỳ chọn)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiemDanh;
