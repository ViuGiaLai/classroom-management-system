import React from 'react';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { formatFileSize } from '../../utils/format';

const MaterialItem = ({ material, onDelete, isTeacher = false, onView }) => {
    const getFileIcon = (fileType) => {
        if (!fileType) return <FileText className="w-5 h-5" />;

        if (fileType.includes('pdf')) {
            return <FileText className="w-5 h-5 text-red-500" />;
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return <FileText className="w-5 h-5 text-blue-500" />;
        } else if (fileType.includes('sheet') || fileType.includes('excel')) {
            return <FileText className="w-5 h-5 text-green-500" />;
        } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
            return <FileText className="w-5 h-5 text-orange-500" />;
        } else {
            return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                    {getFileIcon(material.file_type)}
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">{material.title}</h3>
                    <p className="text-sm text-gray-500">
                        {formatFileSize(material.file_size)} • {new Date(material.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    className="p-2 text-blue-500 rounded-full hover:bg-blue-50"
                    title="Xem tài liệu"
                    onClick={() => onView && onView(material)}
                >
                    <Eye className="w-5 h-5" />
                </button>
                <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
                    title="Tải xuống"
                >
                    <Download className="w-5 h-5" />
                </a>
                {isTeacher && (
                    <button
                        onClick={() => onDelete(material._id)}
                        className="p-2 text-red-500 rounded-full hover:bg-red-50"
                        title="Xóa tài liệu"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MaterialItem;
