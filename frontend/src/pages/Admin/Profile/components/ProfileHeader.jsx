import React from 'react';

const ProfileHeader = ({ editing, onEditClick, onCancelEdit, loading }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
      
      {!editing ? (
        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Chỉnh sửa
        </button>
      ) : (
        <div className="space-x-2">
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
