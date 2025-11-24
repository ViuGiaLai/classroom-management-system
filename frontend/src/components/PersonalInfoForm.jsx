import React from 'react';

const PersonalInfoForm = ({ user, editing, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Họ và tên
        </label>
        <input
          type="text"
          name="full_name"
          value={user.full_name}
          onChange={onChange}
          className={`border rounded-md px-3 py-2 ${!editing ? 'bg-gray-100' : 'border-gray-300'}`}
          disabled={!editing}
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={user.email}
          className="border rounded-md px-3 py-2 bg-gray-100"
          disabled
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Số điện thoại
        </label>
        <input
          type="tel"
          name="phone"
          value={user.phone}
          onChange={onChange}
          className={`border rounded-md px-3 py-2 ${!editing ? 'bg-gray-100' : 'border-gray-300'}`}
          disabled={!editing}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Địa chỉ
        </label>
        <textarea
          name="address"
          value={user.address}
          onChange={onChange}
          className={`border rounded-md px-3 py-2 ${!editing ? 'bg-gray-100' : 'border-gray-300'}`}
          disabled={!editing}
          rows="2"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
