import React from 'react';

const AvatarUpload = ({ user, loading, editing, onAvatarChange }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">
        Ảnh đại diện
      </label>
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src={user?.avatar_url || '/default-avatar.png'}
            alt="avatarUrl"
            className="w-full h-full object-cover"
          />
        </div>
    
        {editing && (
          <label className="cursor-pointer">
            <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
              {loading ? 'Đang tải lên...' : 'Chọn ảnh'}
            </span>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={onAvatarChange}
              className="hidden"
              disabled={loading}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
