import React from 'react';
import { Dialog } from '@headlessui/react';
import { CloseOutlined } from '@ant-design/icons';

const CreateNotificationModal = ({
    isOpen,
    onClose,
    title,
    setTitle,
    content,
    setContent,
    recipientType,
    setRecipientType,
    selectedRole,
    setSelectedRole,
    selectedClass,
    setSelectedClass,
    classes,
    loading,
    sending,
    recipientTypes,
    roles,
    onSubmit
}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                        <CloseOutlined className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-bold">Tạo thông báo mới</h3>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div>
                            <label className="block font-medium mb-1">Tiêu đề</label>
                            <input
                                className="w-full border px-3 py-2 rounded"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="Nhập tiêu đề thông báo"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nội dung</label>
                            <textarea
                                className="w-full border px-3 py-2 rounded"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                required
                                placeholder="Nhập nội dung thông báo"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Gửi đến</label>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={recipientType}
                                onChange={e => setRecipientType(e.target.value)}
                            >
                                {recipientTypes.map(rt => (
                                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                                ))}
                            </select>
                        </div>
                        {recipientType === 'role' && (
                            <div>
                                <label className="block font-medium mb-1">Chọn vai trò</label>
                                <select
                                    className="w-full border px-3 py-2 rounded"
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e.target.value)}
                                >
                                    {roles.map(role => (
                                        <option key={role.value} value={role.value}>{role.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {recipientType === 'class' && (
                            <div>
                                <label className="block font-medium mb-1">Chọn lớp học phần</label>
                                <select
                                    className="w-full border px-3 py-2 rounded"
                                    value={selectedClass}
                                    onChange={e => setSelectedClass(e.target.value)}
                                    disabled={loading}
                                    required
                                >
                                    <option value="">-- Chọn lớp --</option>
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.course_id?.title || cls._id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border rounded hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                                disabled={sending}
                            >
                                {sending ? 'Đang gửi...' : 'Gửi thông báo'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default CreateNotificationModal;
