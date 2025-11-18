import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function FacultyForm({ formData, setFormData, isEdit }) {
  console.log('FacultyForm render - formData:', formData);
  console.log('FacultyForm render - isEdit:', isEdit);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };
      console.log('New formData:', newFormData);
      return newFormData;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên khoa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            placeholder="Nhập tên khoa"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã khoa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code || ''}
            onChange={handleInputChange}
            placeholder="VD: KTCN, KT, CK"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}
