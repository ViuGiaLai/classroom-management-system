import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Upload } from 'lucide-react';
import { Modal, Button } from 'antd';
import MaterialItem from '@/components/materials/MaterialItem';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import MaterialUpload from '@/components/materials/MaterialUpload';
import materialApi from '@/api/materialApi';
import { useAuth } from '@/hooks/useAuth';

const TaiLieu = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewFile, setViewFile] = useState(null);
        const { user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    useEffect(() => {
        setIsTeacher(user?.role === 'teacher');
        fetchMaterials();
    }, [user]);

    const fetchMaterials = async () => {
        try {
            setIsLoading(true);
            const response = await materialApi.getMaterials();
            const materialsList = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                ? response.data
                : [];
            setMaterials(materialsList);
        } catch (error) {
            toast.error('Không thể tải danh sách tài liệu');
            setMaterials([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadSuccess = () => {
        setIsUploadModalOpen(false);
        fetchMaterials();
        toast.success('Tải lên tài liệu thành công');
    };

    const handleDeleteMaterial = async (materialId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
            return;
        }

        try {
            await materialApi.deleteMaterial(materialId);
            toast.success('Đã xóa tài liệu thành công');
            fetchMaterials();
        } catch (error) {
            console.error('Error deleting material:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa tài liệu');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 mr-2 animate-spin" />
                <span>Đang tải tài liệu...</span>
            </div>
        );
    }

    const handleViewMaterial = (material) => {
        setViewFile({ uri: material.file_url, fileType: material.file_type, fileName: material.title });
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewFile(null);
    };

    return (
        <>
            <Modal
                title={viewFile?.fileName || 'Xem tài liệu'}
                open={isViewModalOpen}
                onCancel={handleCloseViewModal}
                footer={null}
                width={1100}
                bodyStyle={{ height: '90vh', padding: 0, overflow: 'hidden' }}
                style={{ top: 24 }}
            >
                <div style={{ height: '88vh', width: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', padding: 0 }}>
                    {viewFile && (
                        <DocViewer
                            documents={[
                                {
                                    uri: viewFile.uri,
                                    fileType: viewFile.fileType,
                                    fileName: viewFile.fileName,
                                },
                            ]}
                            pluginRenderers={DocViewerRenderers}
                            config={{ header: { disableHeader: true } }}
                            style={{ maxHeight: '100%', maxWidth: '100%', boxShadow: 'none', background: 'transparent' }}
                        />
                    )}
                </div>
            </Modal>
            <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tài liệu lớp học</h1>
                {isTeacher && (
                    <Button 
                        type="primary"
                        icon={<Upload className="h-4 w-4" />}
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        Tải lên tài liệu mới
                    </Button>
                )}
            </div>

            {/* Modal Tải lên tài liệu */}
            <Modal
                title="Tải lên tài liệu mới"
                open={isUploadModalOpen}
                onCancel={() => setIsUploadModalOpen(false)}
                footer={null}
                width={600}
            >
                <MaterialUpload 
                    onUploadSuccess={handleUploadSuccess} 
                    onCancel={() => setIsUploadModalOpen(false)}
                />
            </Modal>

            <div className="mb-6">
                <p className="mt-1 text-sm text-gray-500">
                    Quản lý và chia sẻ tài liệu học tập
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tất cả tài liệu ({materials.length})
                    </h2>
                </div>

                {materials.length === 0 ? (
                    <div className="p-8 text-center bg-white border border-gray-200 rounded-lg">
                        <p className="text-gray-500">Chưa có tài liệu nào được tải lên</p>
                        {isTeacher && (
                            <p className="mt-2 text-sm text-gray-500">
                                Sử dụng biểu mẫu bên trên để tải lên tài liệu mới
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {materials.map((material) => (
                            <MaterialItem
                                key={material._id}
                                material={material}
                                onDelete={handleDeleteMaterial}
                                isTeacher={isTeacher}
                                onView={handleViewMaterial}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default TaiLieu;
