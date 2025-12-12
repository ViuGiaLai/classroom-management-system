import React, { useState, useMemo } from 'react';
import { Input, Card, Row, Col, Button, Tag, Empty } from 'antd';
import { Eye, Download } from 'lucide-react';
import './index.css';

const { Search } = Input;

const mockDocs = [
  {
    id: 'd1',
    title: 'Bài giảng tuần 1 - Giới thiệu',
    uploadedAt: '15/1/2024',
    type: 'PDF',
  },
  {
    id: 'd2',
    title: 'Slide bài giảng - Biến và Kiểu dữ liệu',
    uploadedAt: '15/1/2024',
    type: 'PDF',
  },
];

const TaiLieu = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockDocs;
    return mockDocs.filter((d) => d.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="materials-page p-6">
      <h1 className="materials-title">Tài Liệu Học Tập</h1>
      <p className="materials-sub">Xem và tải tài liệu từ các môn học</p>

      <div className="search-wrap">
        <Search
          placeholder="Tìm kiếm tài liệu..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          allowClear
        />
      </div>

      <div className="docs-list">
        {filtered.length === 0 ? (
          <Empty description="Không có tài liệu" />
        ) : (
          <Row gutter={[0, 16]}>
            {filtered.map((doc) => (
              <Col span={24} key={doc.id}>
                <Card className="doc-card">
                  <div className="doc-row">
                    <div className="doc-main">
                      <div className="doc-title">{doc.title}</div>
                      <div className="doc-meta">Tải lên: {doc.uploadedAt}</div>
                    </div>

                    <div className="doc-actions">
                      <Tag className="doc-type">{doc.type}</Tag>
                      <Button type="default" size="small" className="doc-btn">
                        <Eye size={14} /> <span> Xem</span>
                      </Button>
                      <Button type="primary" size="small" className="doc-btn primary">
                        <Download size={14} /> <span> Tải xuống</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default TaiLieu;
