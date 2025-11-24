import React from 'react';

const ChangePassword = ({ editing }) => {
  if (!editing) return null;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Đổi mật khẩu
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            name="current_password"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="new_password"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
