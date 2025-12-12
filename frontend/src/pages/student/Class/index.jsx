import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Spin, Empty } from 'antd';
import { ChevronRight, Calendar, User, BookOpen } from 'lucide-react';
import { getEnrolledClasses } from '@/api/ClassApi';
import './index.css';

const StudentClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  const fetchEnrolledClasses = async () => {
    try {
      setLoading(true);
      // Mau lop hoc
      const mockClasses = [
        {
          _id: '1',
          courseCode: 'CS101',
          className: 'Lập trình căn bản',
          instructor: { name: 'Nguyễn Văn A' },
          schedule: 'Thứ 2, 7:00 - 9:00',
          semester: 'HK1 2024',
        },
      ];

      // Nếu muốn dùng API thật, uncomment 2 dòng bên dưới
      // const response = await getEnrolledClasses();
      // setClasses(Array.isArray(response.data) ? response.data : []);

      setClasses(mockClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClass = (classId) => {
    navigate(`/student/classes/${classId}`);
  };

  return (
    <div className="student-classes-container compact p-4">
      <div className="header">
        <h1 className="title">Lớp học của tôi</h1>
        <p className="subtitle">Danh sách lớp bạn đang tham gia</p>
      </div>

      <Spin spinning={loading}>
        {classes.length === 0 ? (
          <Empty description="Không có lớp học nào" />
        ) : (
          <Row gutter={[16, 16]}>
            {classes.map((c) => (
              <Col xs={24} sm={12} lg={8} key={c._id}>
                <Card className="class-card compact" hoverable>
                  <div className="card-top">
                    <div className="name">{c.className}</div>
                    <div className="code">{c.courseCode}</div>
                  </div>

                  <div className="card-info">
                    <div className="info-item">
                      <User size={14} />
                      <span>{c.instructor?.name || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={14} />
                      <span>{c.schedule || '-'}</span>
                    </div>
                    <div className="info-item">
                      <BookOpen size={14} />
                      <span>{c.semester || '-'}</span>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="small"
                    block
                    className="view-btn"
                    onClick={() => handleViewClass(c._id)}
                  >
                    Xem chi tiết
                    <ChevronRight size={14} />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default StudentClasses;
