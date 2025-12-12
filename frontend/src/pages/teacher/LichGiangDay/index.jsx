import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Empty, Spin, Badge } from 'antd';
import { Calendar, MapPin, Users, BookOpen } from 'lucide-react';
import { getMyClasses } from '@/api/ClassApi';
import dayjs from 'dayjs';

const WEEK_DAYS = [
  { key: 'thu2', label: 'Thứ 2' },
  { key: 'thu3', label: 'Thứ 3' },
  { key: 'thu4', label: 'Thứ 4' },
  { key: 'thu5', label: 'Thứ 5' },
  { key: 'thu6', label: 'Thứ 6' },
  { key: 'thu7', label: 'Thứ 7' },
  { key: 'cn', label: 'Chủ nhật' },
];

const LichGiangDay = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState({});
  const [weekRange, setWeekRange] = useState({ start: null, end: null });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    // compute current week (Monday - Sunday)
    const now = dayjs();
    const day = now.day(); // 0 (Sun) - 6 (Sat)
    const monday = now.subtract(day === 0 ? 6 : day - 1, 'day');
    const sunday = monday.add(6, 'day');
    setWeekRange({ start: monday, end: sunday });
  }, []);

  useEffect(() => {
    groupByDay();
  }, [classes]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await getMyClasses();
      const data = Array.isArray(res?.data) ? res.data : [];
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes for schedule', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const parseSchedule = (scheduleStr) => {
    if (!scheduleStr) return { day: null, times: [], room: null };
    
    // Handle format: "Thứ 3 - Tiết 4-6, Phòng A102"
    const dayMatch = scheduleStr.match(/Thứ\s*([2-7]|CN|Chủ nhật)/i);
    const timeMatch = scheduleStr.match(/Tiết\s*(\d+)-(\d+)/i);
    const roomMatch = scheduleStr.match(/Phòng\s*([A-Za-z0-9\-\s]+)/i);
    
    // Map day names to keys
    const dayMap = {
      'thứ 2': 'thu2', '2': 'thu2', 'thu2': 'thu2',
      'thứ 3': 'thu3', '3': 'thu3', 'thu3': 'thu3',
      'thứ 4': 'thu4', '4': 'thu4', 'thu4': 'thu4',
      'thứ 5': 'thu5', '5': 'thu5', 'thu5': 'thu5',
      'thứ 6': 'thu6', '6': 'thu6', 'thu6': 'thu6',
      'thứ 7': 'thu7', '7': 'thu7', 'thu7': 'thu7',
      'chủ nhật': 'cn', 'cn': 'cn', 'chu nhat': 'cn'
    };

    // Get day key
    const dayKey = dayMatch ? dayMatch[0].toLowerCase() : '';
    const day = dayMap[dayKey] || 'other';
    
    // Convert period to time (e.g., Tiết 4-6 -> 09:30-11:00)
    let times = [];
    if (timeMatch) {
      const startPeriod = parseInt(timeMatch[1]);
      const endPeriod = parseInt(timeMatch[2]);
      
      // Convert period to time (each period is 1.5 hours, starting from 7:00)
      const startHour = 7 + Math.floor((startPeriod - 1) / 2);
      const startMinute = (startPeriod % 2 === 1) ? '00' : '30';
      const endHour = 7 + Math.floor(endPeriod / 2);
      const endMinute = (endPeriod % 2 === 0) ? '00' : '30';
      
      times = [`${startHour}:${startMinute}-${endHour}:${endMinute}`];
    }
    
    // Extract room
    const room = roomMatch ? roomMatch[1].trim() : null;
    
    return { day, times, room };
  };
  
  // For backward compatibility
  const detectDay = (scheduleStr) => parseSchedule(scheduleStr).day;
  const extractTime = (scheduleStr) => parseSchedule(scheduleStr).times;
  const extractRoom = (scheduleStr) => parseSchedule(scheduleStr).room;

  // No placeholders needed - we'll show a message in the UI
  const generatePlaceholders = () => [];

  const groupByDay = () => {
    const map = {
      thu2: [],
      thu3: [],
      thu4: [],
      thu5: [],
      thu6: [],
      thu7: [],
      cn: [],
      other: [],
    };

    classes.forEach((c) => {
      if (!c || !c.schedule) return;
      
      const { day: dayKey } = parseSchedule(c.schedule);
      const finalDayKey = dayKey || 'other';
      
      if (map[finalDayKey] !== undefined) {
        map[finalDayKey].push(c);
      } else {
        map.other.push(c);
      }
    });

    // Sort each day's classes by time
    Object.keys(map).forEach(day => {
      map[day].sort((a, b) => {
        const timeA = parseSchedule(a.schedule).times[0] || '';
        const timeB = parseSchedule(b.schedule).times[0] || '';
        return timeA.localeCompare(timeB);
      });
    });

    setGrouped(map);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
        <span className="ml-2">Đang tải lịch giảng dạy...</span>
      </div>
    );
  }

  // small helper to render class card inside day
  const renderClassItem = (cls) => {
    if (!cls) return null;
    
    const { times, room } = parseSchedule(cls.schedule || '');
    const studentCount = cls.current_enrollment || 0;
    const courseCode = cls.course_id?.code || cls._id?.substring(0, 8) || 'N/A';

    // pick color depending on course id hash
    const colors = ['blue', 'cyan', 'purple', 'geekblue', 'magenta'];
    const color = colors[Math.abs((cls._id || '').split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];

    return (
      <Card key={cls._id} className="mb-3 shadow-sm border-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-2">
              {times && times.length > 0 ? (
                times.map((t, idx) => (
                  <div key={idx} className={`px-3 py-1 rounded-full bg-${color}-50 inline-block`}>
                    <span className={`text-${color}-600 font-medium`}>{t}</span>
                  </div>
                ))
              ) : (
                <Tag color="blue">—</Tag>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">{cls.course_id?.title || 'Môn học chưa có tên'}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Mã lớp: {courseCode} • Số SV: {studentCount}/{cls.max_capacity || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Học kỳ: {cls.semester || 'N/A'} - {cls.year || 'N/A'}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-4">
            {room && (
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-500" /> <span className="text-gray-700">Phòng {room}</span></div>
            )}
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" /> <span className="text-gray-700">{studentCount} sinh viên</span></div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Lịch Giảng Dạy</h1>
        <p className="mt-1 text-sm text-gray-500">Thời khóa biểu giảng dạy của bạn</p>
      </div>

      <Card className="mb-6 shadow-sm border-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-500">Tuần giảng dạy:</div>
              <div className="text-sm text-blue-600 font-medium">{weekRange.start ? weekRange.start.format('DD/MM/YYYY') : ''} - {weekRange.end ? weekRange.end.format('DD/MM/YYYY') : ''}</div>
              <div className="text-xs text-gray-400">Học kỳ 2, Năm học 2024-2025</div>
            </div>
          </div>
          <div>
            <Tag color="processing">Tuần giảng dạy hiện tại</Tag>
          </div>
        </div>
      </Card>

      {WEEK_DAYS.map((d) => (
        <Card key={d.key} className="mb-4">
          <h3 className="text-lg font-semibold mb-3">{d.label}</h3>
          <div>
            {grouped[d.key]?.length > 0 ? (
              grouped[d.key].map((cls) => renderClassItem(cls))
            ) : (
              <div className="text-center py-4 text-gray-400">
                Không có lịch học
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* other / unspecified */}
      {grouped.other && grouped.other.length > 0 && (
        <Card className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Khác</h3>
          {grouped.other.map((cls) => renderClassItem(cls))}
        </Card>
      )}
    </div>
  );
};

export default LichGiangDay;
