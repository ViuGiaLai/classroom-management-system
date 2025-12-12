import React, { useState, useMemo, useEffect } from 'react';
import { Input, Card, Row, Col, Button, Tag, Empty, Spin, message, Modal } from 'antd';
import { Eye, Download, FileText, FileImage, File } from 'lucide-react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import materialApi from '@/api/materialApi';
import './index.css';

const { Search } = Input;

const TaiLieu = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter((d) => d.title.toLowerCase().includes(q));
  }, [query, materials]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await materialApi.getMaterials();
        setMaterials(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching materials:', error);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleDownload = async (materialId, fileName, e) => {
    e?.stopPropagation();
    try {
      const response = await materialApi.downloadMaterial(materialId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error('Tải tài liệu thất bại');
    }
  };

  const handlePreview = (doc) => {
    setCurrentDoc({
      uri: doc.file_url,
      fileType: doc.file_type,
      fileName: doc.title
    });
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
    setCurrentDoc(null);
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File size={48} />;
    
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FileText size={48} className="text-red-500" />;
    if (type.includes('image')) return <FileImage size={48} className="text-blue-500" />;
    if (type.includes('text') || type.includes('word') || type.includes('document') || type.includes('vnd.openxmlformats')) 
      return <FileText size={48} className="text-blue-600" />;
    return <File size={48} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Chưa cập nhật' : date.toLocaleDateString('vi-VN');
    } catch (e) {
      return 'Chưa cập nhật';
    }
  };

  const getCourseName = (doc) => {
    if (doc.course?.name) return doc.course.name;
    if (doc.courseId?.name) return doc.courseId.name;
    if (doc.course_name) return doc.course_name;
    return 'Chưa xác định';
  };

  return (
    <div className="materials-page p-6">
      <Modal
        title={currentDoc?.fileName || 'Xem tài liệu'}
        open={previewVisible}
        onCancel={handleClosePreview}
        footer={[
          <Button key="close" onClick={handleClosePreview}>
            Đóng
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            onClick={(e) => {
              handleDownload(currentDoc?._id, currentDoc?.fileName, e);
            }}
            icon={<Download size={14} />}
          >
            Tải xuống
          </Button>
        ]}
        width={1100}
        bodyStyle={{ height: '90vh', padding: 0, overflow: 'hidden' }}
        style={{ top: 24 }}
        className="preview-modal"
      >
        <div style={{ 
          height: '88vh', 
          width: '100%', 
          overflow: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'transparent', 
          padding: 0 
        }}>
          {currentDoc && (
            <DocViewer
              documents={[{
                uri: currentDoc.uri,
                fileType: currentDoc.fileType,
                fileName: currentDoc.fileName,
              }]}
              pluginRenderers={DocViewerRenderers}
              config={{ header: { disableHeader: true } }}
              style={{ 
                maxHeight: '100%', 
                maxWidth: '100%', 
                boxShadow: 'none', 
                background: 'transparent' 
              }}
            />
          )}
        </div>
      </Modal>
      <h1 className="materials-title">Tài Liệu Học Tập</h1>
      <p className="materials-sub">Xem và tải tài liệu từ các môn học</p>

      <div className="search-wrap">
        <Search
          placeholder="Tìm kiếm tài liệu..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          allowClear
          loading={loading}
        />
      </div>

      <div className="docs-list">
        {loading ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <Empty description="Không có tài liệu nào" />
        ) : (
          <Row gutter={[0, 16]}>
            {filtered.map((doc) => (
              <Col span={24} key={doc._id}>
                <Card 
                  className="doc-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePreview(doc)}
                >
                  <div className="doc-row">
                    <div className="doc-main">
                      <div className="doc-title">{doc.title}</div>
                      <div className="doc-meta">
                        <span>Môn: {getCourseName(doc)}</span>
                        <span className="mx-2">•</span>
                        <span>Tải lên: {formatDate(doc.createdAt || doc.uploadDate || doc.created_at)}</span>
                      </div>
                    </div>

                    <div className="doc-actions">
                      <Tag className="doc-type">{doc.file_type?.toUpperCase() || 'FILE'}</Tag>
                      <div className="flex gap-2">
                        <Button 
                          type="default" 
                          size="small" 
                          className="doc-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(doc);
                          }}
                          icon={<Eye size={14} />}
                        >
                          Xem
                        </Button>
                        <Button 
                          type="primary" 
                          size="small" 
                          className="doc-btn primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc._id, doc.title, e);
                          }}
                          icon={<Download size={14} />}
                        >
                          Tải xuống
                        </Button>
                      </div>
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
