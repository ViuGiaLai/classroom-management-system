import React from "react";
import UserForm from "./UserForm";
import StudentFields from "./StudentFields";
import TeacherFields from "./TeacherFields";

const UserModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  editingUser, 
  formData, 
  setFormData, 
  handleSubmit, 
  submitLoading 
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto">
          <UserForm
            editingUser={editingUser}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            submitLoading={submitLoading}
            setIsModalOpen={setIsModalOpen}
          >
            {/* Role-specific fields */}
            <StudentFields formData={formData} handleInputChange={handleInputChange} />
            <TeacherFields formData={formData} handleInputChange={handleInputChange} />
          </UserForm>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
