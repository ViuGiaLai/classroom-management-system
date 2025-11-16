import React from "react";

const TeacherFields = ({ formData, handleInputChange }) => {
  return (
    <>
      {/* Teacher-specific fields - only show when role is teacher */}
      {formData.role === 'teacher' && (
        <>
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Thông tin giảng viên</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Chức vụ
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn chức vụ</option>
                <option value="Giảng viên">Giảng viên</option>
                <option value="Phó giáo sư">Phó giáo sư</option>
                <option value="Giáo sư">Giáo sư</option>
                <option value="Trưởng bộ môn">Trưởng bộ môn</option>
                <option value="Phó trưởng khoa">Phó trưởng khoa</option>
                <option value="Trưởng khoa">Trưởng khoa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Học vị
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Chọn học vị</option>
                <option value="Cử nhân">Cử nhân</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
                <option value="Phó giáo sư">Phó giáo sư</option>
                <option value="Giáo sư">Giáo sư</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chuyên môn
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="VD: Công nghệ phần mềm, Khoa học máy tính..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Khoa (ID)
              </label>
              <input
                type="text"
                name="faculty_id"
                value={formData.faculty_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="ID Khoa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bộ môn (ID)
              </label>
              <input
                type="text"
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="ID Bộ môn"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeacherFields;
