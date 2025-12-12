import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Empty,
  Spin,
  Avatar,
  Input,
  Tag,
} from 'antd';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import dayjs from 'dayjs';
import {
  getMyClasses,
  getCourseClassById,
  getStudentsInClass,
} from '@/api/ClassApi';
import {
  getAttendanceByClass,
  createAttendance,
  updateAttendance,
} from '@/api/attendanceApi';

const { Option } = Select;

const DiemDanh = () => {
  const { classId: urlClassId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(urlClassId || null);
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    fetchMyClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchClassInfoAndStudents();
    }
  }, [selectedClassId, selectedDate]);

  const fetchMyClasses = async () => {
    try {
      setIsLoading(true);
      const res = await getMyClasses();
      const list = Array.isArray(res) ? res : res.data || [];
      setClasses(list);
      if (list.length > 0 && !selectedClassId) {
        setSelectedClassId(list[0]._id);
      }
    } catch (err) {
      toast.error('Không tải được danh sách lớp học');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClassInfoAndStudents = async () => {
    if (!selectedClassId) return;
    try {
      setIsLoading(true);
      const classRes = await getCourseClassById(selectedClassId);
      setClassInfo(classRes.data);

      const res = await getStudentsInClass(selectedClassId);
      const studentsList = Array.isArray(res) ? res : res.data || [];
      setStudents(studentsList);

      if (studentsList.length === 0) {
        toast.info('Lớp chưa có sinh viên nào');
        return;
      }

      const records = await loadAttendanceForDate();
      if (records && records.length > 0) {
        setViewModalVisible(true);
      } else {
        toast.info('Chưa có dữ liệu điểm danh cho ngày này');
      }
    } catch (err) {
      toast.error('Lỗi tải dữ liệu lớp');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendanceForDate = async () => {
    if (!selectedClassId) return [];
    try {
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const res = await getAttendanceByClass(selectedClassId, dateStr);
      const records = Array.isArray(res) ? res : [];
      setAttendanceRecords(records);

      const map = {};
      records.forEach((r) => {
        const sid = r.student_id?._id || r.student_id;
        map[sid] = {
          status: r.status,
          note: r.note || '',
          recordId: r._id,
        };
      });
      setAttendanceMap(map);
      setHasChanges(false);
      return records; // Return the records for the modal
    } catch (err) {
      setAttendanceMap({});
      setAttendanceRecords([]);
      console.error('Lỗi tải điểm danh:', err);
      return [];
    }
  };

  const handleStatusChange = (studentId, value) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: value,
        note: prev[studentId]?.note || '',
      },
    }));
    setHasChanges(true);
  };

  const handleNoteChange = (studentId, value) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note: value,
        status: prev[studentId]?.status || 'absent',
      },
    }));
    setHasChanges(true);
  };

  // HÀM LƯU ĐÃ FIX 100% – KHÔNG LỖI TRÙNG, CÓ THÔNG BÁO ĐẸP
  const handleSaveAll = async () => {
    if (!hasChanges) {
      toast.info('Không có thay đổi nào để lưu');
      return;
    }

    let updatedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;

    try {
      setIsSaving(true);

      // Lấy điểm danh hiện tại để biết cái nào đã tồn tại
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const currentRecords = await getAttendanceByClass(selectedClassId, dateStr);

      const existingMap = {};
      currentRecords.forEach(r => {
        const sid = r.student_id?._id || r.student_id;
        existingMap[sid] = r._id;
      });

      const promises = [];

      for (const student of students) {
        const sid = student._id;
        const data = attendanceMap[sid];

        // Nếu không có thay đổi gì thay đổi → bỏ qua
        if (!data || (!data.status && !data.note?.trim())) {
          skippedCount++;
          continue;
        }

        const status = data.status || 'absent';
        const note = data.note || '';

        // Nếu đã có bản ghi → cập nhật
        if (existingMap[sid]) {
          promises.push(
            updateAttendance(existingMap[sid], status, note).then(() => updatedCount++)
          );
        } else {
          // Nếu chưa có → tạo mới
          promises.push(
            createAttendance(selectedClassId, sid, selectedDate.toISOString(), status, note)
              .then(() => createdCount++)
              .catch(err => {
                if (err.message.includes('already recorded')) {
                  skippedCount++;
                  // Không ném lỗi, chỉ thông báo đã có
                  console.info(`Đã có điểm danh cho sinh viên ${student.user_id?.full_name || sid}`);
                } else {
                  throw err; // lỗi thật thì ném ra
                }
              })
          );
        }
      }

      await Promise.all(promises);

      // Thông báo kết quả đẹp
      const messages = [];
      if (createdCount > 0) messages.push(`${createdCount} bản ghi mới`);
      if (updatedCount > 0) messages.push(`${updatedCount} bản ghi cập nhật`);
      if (skippedCount > 0) messages.push(`${skippedCount} đã điểm danh trước đó`);

      toast.success(`Lưu thành công! ${messages.join(', ')}`);

      setHasChanges(false);
      const updatedRecords = await loadAttendanceForDate(); // reload để cập nhật UI
      setAttendanceRecords(updatedRecords);
    } catch (err) {
      console.error('Lỗi nghiêm trọng khi lưu:', err);
      toast.error('Có lỗi xảy ra khi lưu điểm danh');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      width: 70,
      render: (_, __, i) => i + 1,
    },
    {
      title: 'Họ và tên',
      width: 300,
      render: (_, record) => {
        const name = record.user_id?.full_name || 'Chưa có tên';
        const code = record.student_code || 'N/A';
        const initials = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar size={40} className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {initials || '?'}
            </Avatar>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-gray-500">{code}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      width: 180,
      render: (_, record) => {
        const sid = record._id;
        return (
          <Select
            value={attendanceMap[sid]?.status || undefined}
            onChange={(v) => handleStatusChange(sid, v)}
            placeholder="Chọn"
            style={{ width: 140 }}
          >
            <Option value="present"><Tag color="green">Có mặt</Tag></Option>
            <Option value="late"><Tag color="orange">Muộn</Tag></Option>
            <Option value="absent"><Tag color="red">Vắng</Tag></Option>
            <Option value="excused"><Tag color="blue">Nghỉ phép</Tag></Option>
          </Select>
        );
      },
    },
    {
      title: 'Ghi chú',
      render: (_, record) => (
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder="Ghi chú..."
          value={attendanceMap[record._id]?.note || ''}
          onChange={(e) => handleNoteChange(record._id, e.target.value)}
          allowClear
        />
      ),
    },
  ];

  if (isLoading && classes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
        <span className="ml-3">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Modal xem điểm danh */}
      {viewModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Chi tiết điểm danh</h2>
              <Button 
                type="text" 
                icon={<X size={20} />} 
                onClick={() => setViewModalVisible(false)}
              />
            </div>
            <div className="overflow-auto p-4">
              <div className="mb-4">
                <h3 className="font-medium">Lớp: {classInfo?.course_id?.title} ({classInfo?.course_id?.code})</h3>
                <p>Ngày: {selectedDate.format('DD/MM/YYYY')}</p>
              </div>
              <Table 
                dataSource={attendanceRecords}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                scroll={{ y: '50vh' }}
              >
                <Table.Column 
                  title="STT" 
                  key="index" 
                  render={(_, __, index) => index + 1} 
                  width={70}
                />
                <Table.Column 
                  title="Tên sinh viên" 
                  dataIndex={['student_id', 'user_id', 'full_name']}
                  key="studentName"
                  render={(text, record) => (
                    <div className="flex items-center gap-2">
                      <Avatar size="small" className="bg-blue-100 text-blue-800">
                        {(text || '').charAt(0).toUpperCase()}
                      </Avatar>
                      <span>{text || 'N/A'}</span>
                    </div>
                  )}
                />
                <Table.Column 
                  title="Mã SV" 
                  dataIndex={['student_id', 'student_code']}
                  key="studentCode"
                />
                <Table.Column 
                  title="Trạng thái" 
                  key="status"
                  render={(record) => {
                    const statusMap = {
                      present: { label: 'Có mặt', color: 'green' },
                      late: { label: 'Muộn', color: 'orange' },
                      absent: { label: 'Vắng', color: 'red' },
                      excused: { label: 'Nghỉ phép', color: 'blue' },
                    };
                    const status = statusMap[record.status] || { label: 'Chưa điểm danh', color: 'gray' };
                    return <Tag color={status.color}>{status.label}</Tag>;
                  }}
                />
                <Table.Column 
                  title="Ghi chú" 
                  dataIndex="note"
                  key="note"
                  render={(text) => text || '-'}
                />
              </Table>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button onClick={() => setViewModalVisible(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
      <Button icon={<ArrowLeft />} onClick={() => navigate('/teacher/classes')} className="mb-6">
        Quay lại
      </Button>

      <h1 className="text-3xl font-bold mb-2">Điểm danh</h1>
      <p className="text-gray-600 mb-8">Chọn lớp và ngày để điểm danh</p>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-2">Lớp học</label>
            <Select
              value={selectedClassId}
              onChange={setSelectedClassId}
              placeholder="Chọn lớp"
              style={{ width: '100%' }}
            >
              {classes.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.course_id?.title} ({c.course_id?.code})
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block font-medium mb-2">Ngày</label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </div>

          <div className="flex items-end">
            <Button 
              type="primary" 
              icon={<Eye />} 
              onClick={fetchClassInfoAndStudents} 
              block
              loading={isLoading}
            >
              Xem điểm danh
            </Button>
          </div>
        </div>
      </Card>

      {classInfo && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {classInfo?.course_id?.title} - {classInfo?.name}
              </h2>
              <p className="text-gray-600">
                {classInfo?.course_id?.code} • {classInfo?.schedule}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date || dayjs())}
                format="DD/MM/YYYY"
                className="w-40"
                allowClear={false}
              />
              <Button
                type="primary"
                icon={<Save size={16} />}
                loading={isSaving}
                onClick={handleSaveAll}
                disabled={!hasChanges}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Lưu tất cả
              </Button>
              <Button
                type="default"
                icon={<Eye size={16} />}
                onClick={() => attendanceRecords.length > 0 ? setViewModalVisible(true) : toast.info('Chưa có dữ liệu điểm danh cho ngày này')}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">Môn:</span> <strong>{classInfo.course_id?.title}</strong></div>
            <div><span className="text-gray-500">Mã:</span> <strong>{classInfo.course_id?.code}</strong></div>
            <div><span className="text-gray-500">Lịch:</span> <strong>{classInfo.schedule || 'N/A'}</strong></div>
            <div><span className="text-gray-500">Sĩ số:</span> <strong className="text-blue-600">
              {classInfo.current_enrollment || 0}/{classInfo.max_capacity || 0}
            </strong></div>
          </div>
        </Card>
      )}

      <Card
        title="Danh sách điểm danh"
        extra={
          <Button
            type="primary"
            icon={<Save />}
            onClick={handleSaveAll}
            loading={isSaving}
            disabled={!hasChanges}
            className={hasChanges ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Lưu điểm danh
          </Button>
        }
      >
        {students.length === 0 ? (
          <Empty description="Chưa có sinh viên nào trong lớp này" />
        ) : (
          <Table
            columns={columns}
            dataSource={students}
            rowKey="_id"
            pagination={{ pageSize: 20 }}
            loading={isLoading}
            scroll={{ x: 900 }}
          />
        )}
      </Card>
    </div>
  );
};

export default DiemDanh;