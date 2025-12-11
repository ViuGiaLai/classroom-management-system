import React, { useState, useEffect } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import materialApi from '@/api/materialApi';
import { getCourses } from '@/api/courseApi';
import { toast } from 'react-toastify';
import { Button, Progress, Upload, Form, Input, Card, Select, Spin } from 'antd';

const { Dragger } = Upload;

const MaterialUpload = ({ classId, onUploadSuccess, onCancel }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses();
                const coursesList = Array.isArray(response?.data) ? response.data : [];
                setCourses(coursesList);
                
                if (classId) {
                    form.setFieldsValue({ courseId: classId });
                } else if (coursesList.length > 0) {
                    form.setFieldsValue({ courseId: coursesList[0]?._id });
                } else {
                    toast.warning('Không tìm thấy khóa học nào. Vui lòng tạo hoặc được gán vào một khóa học trước khi tải lên tài liệu.');
                }
            } catch (error) {
                console.error('Error fetching courses:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    stack: error.stack
                });
                toast.error(`Không thể tải danh sách khóa học: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [classId, form]);

    const handleSubmit = async () => {
        const formValues = await form.validateFields();
        const selectedClassId = classId || formValues.courseId;
        
        if (!selectedClassId) {
            toast.error('Vui lòng chọn khóa học');
            return;
        }

        if (!file) {
            toast.error('Vui lòng chọn file cần tải lên');
            return;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);
            
            const config = {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 90) / (progressEvent.total || 1)
                    );
                    setUploadProgress(percentCompleted);
                }
            };

            const title = form.getFieldValue('title')?.trim() || file.name.replace(/\.[^/.]+$/, '');
            
            console.log('Starting file upload:', {
                courseId: selectedClassId,
                title,
                file: file.name,
                size: file.size,
                type: file.type
            });

            await materialApi.uploadMaterial(selectedClassId, title, file, config);
            
            setUploadProgress(100);
            
            toast.success('Tải lên tài liệu thành công');
            form.resetFields();
            setFile(null);
            setUploadProgress(0);
            if (onUploadSuccess) {
                onUploadSuccess();
            }
            
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Có lỗi xảy ra khi tải lên tài liệu';
            toast.error(errorMessage);
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFile(null);
    };

    return (
        <Card 
            className="shadow-sm"
            bodyStyle={{ padding: '24px' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ title: '' }}
            >
                {!classId && (
                    <Form.Item
                        name="courseId"
                        label="Chọn Lớp"
                        rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}
                    >
                        <Select
                            placeholder="Chọn Lớp"
                            loading={loading}
                            disabled={loading}
                        >
                            {courses.map(course => (
                                <Select.Option key={course._id} value={course._id}>
                                    {course.name || `${course.title}`}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item
                    label="Tiêu đề tài liệu"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tài liệu' }]}
                >
                    <Input 
                        placeholder="Nhập tiêu đề tài liệu"
                        disabled={isUploading}
                    />
                </Form.Item>

                <Form.Item
                    label="Chọn tệp"
                    name="file"
                    rules={[{ required: true, message: 'Vui lòng chọn file cần tải lên' }]}
                >
                    <Dragger
                        name="file"
                        multiple={false}
                        showUploadList={false}
                        beforeUpload={(file) => {
                            if (file.size > 10 * 1024 * 1024) {
                                toast.error('Kích thước file không được vượt quá 10MB');
                                return Upload.LIST_IGNORE;
                            }
                            setFile(file);
                            if (!form.getFieldValue('title')) {
                                form.setFieldsValue({ title: file.name.split('.').slice(0, -1).join('.') });
                            }
                            return false;
                        }}
                        disabled={isUploading}
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadIcon className="w-10 h-10 mx-auto text-gray-400" />
                        </p>
                        <p className="ant-upload-text">
                            {file ? file.name : 'Nhấn hoặc kéo thả file vào đây'}
                        </p>
                        <p className="ant-upload-hint">
                            Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT (tối đa 10MB)
                        </p>
                    </Dragger>
                </Form.Item>
                
                {uploadProgress > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Đang tải lên...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <Progress 
                            percent={uploadProgress} 
                            status={uploadProgress === 100 ? 'success' : 'active'}
                            showInfo={false}
                            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <Button 
                        onClick={() => onCancel ? onCancel() : form.resetFields()}
                        disabled={isUploading}
                    >
                        Hủy
                    </Button>
                    <Button 
                        type="primary"
                        htmlType="submit"
                        loading={isUploading}
                        disabled={!file}
                    >
                        {isUploading ? 'Đang tải lên...' : 'Tải lên'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default MaterialUpload;
