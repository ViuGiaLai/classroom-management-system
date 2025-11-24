import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateProfile, getProfile } from '@/api/userApi';
import { getUser } from '@/utils/auth';
import { format } from 'date-fns';
import api from '@/api/axiosConfig';
import { getOrganizationById } from '@/api/organizationApi';

import ProfileHeader from '@/components/ProfileHeader';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import AvatarUpload from '@/components/AvatarUpload';
import OrganizationInfo from '@/components/OrganizationInfo';
import ChangePassword from '@/components/ChangePassword';

const Profile = () => {
    const [user, setUser] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        gender: 'male',
        date_of_birth: '',
        avatar_url: '',
        role: ''
    });

    const [roleSpecificData, setRoleSpecificData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
     const [organization, setOrganization] = useState(null);
    const [loadingOrg, setLoadingOrg] = useState(false);
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const currentUser = getUser();
            setLoading(true);
            const response = await getProfile();

            if (response.success && response.user) {
                const userData = response.user;

                setUser({
                    full_name: userData.full_name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    gender: userData.gender || 'male',
                    date_of_birth: userData.date_of_birth
                        ? format(new Date(userData.date_of_birth), 'yyyy-MM-dd')
                        : '',
                    avatar_url: userData.avatar_url || '',
                    role: userData.role || ''
                });
                // riêng
                if (currentUser.role === 'admin' && currentUser.organization_id) {
                    loadOrganizationData(currentUser.organization_id);
                }
                
                // Set role-specific data
                if (userData.role === 'student' && userData.student) {
                    setRoleSpecificData({
                        type: 'student',
                        ...userData.student
                    });
                } else if (userData.role === 'teacher' && userData.teacher) {
                    setRoleSpecificData({
                        type: 'teacher',
                        ...userData.teacher
                    });
                } else {
                    setRoleSpecificData(null);
                }

                // Cập nhật localStorage
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
            toast.error('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const loadOrganizationData = async (orgId) => {
        try {
            setLoadingOrg(true);
            const response = await getOrganizationById(orgId);
            setOrganization(response.data);
        } catch (error) {
            console.error('Lỗi khi tải thông tin tổ chức:', error);
            toast.error('Không thể tải thông tin tổ chức');
        } finally {
            setLoadingOrg(false);
        }
    };

    const uploadAvatar = async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await api.post('/upload/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.avatarUrl;
        } catch (error) {
            console.error('Upload thất bại:', error);
            throw new Error('Không thể tải lên ảnh đại diện');
        }
    };

    const handleChange = async (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files && files[0]) {
            await handleAvatarUpload(files[0]);
        } else {
            setUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAvatarUpload = async (file) => {
        try {
            setLoading(true);
            const avatarUrl = await uploadAvatar(file);
            setUser(prev => ({
                ...prev,
                avatar_url: avatarUrl
            }));
            toast.success('Tải lên ảnh đại diện thành công');
        } catch (error) {
            toast.error(error.message || 'Có lỗi khi tải lên ảnh');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToUpdate = {
                full_name: user.full_name,
                phone: user.phone,
                address: user.address,
                gender: user.gender,
                date_of_birth: user.date_of_birth,
                avatar_url: user.avatar_url
            };

            const response = await updateProfile(dataToUpdate);

            if (response.success) {
                // Cập nhật localStorage
                localStorage.setItem('user', JSON.stringify(response.user));

                // Reload data
                await loadUserData();

                setEditing(false);
                toast.success('Cập nhật thông tin thành công');
            }
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => setEditing(true);

    const handleCancelEdit = () => {
        loadUserData();
        setEditing(false);
    };

    // Render role-specific information (read-only)
    const renderRoleInfo = () => {
        if (!roleSpecificData) return null;

        if (roleSpecificData.type === 'student') {
            return (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Thông tin sinh viên
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Mã sinh viên
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.student_code || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Lớp hành chính
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.administrative_class || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Khoa
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.faculty?.name || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Bộ môn
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.department?.name || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Trạng thái
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.status === 'studying' ? 'Đang học' : roleSpecificData.status || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Năm nhập học
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.year_of_admission || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (roleSpecificData.type === 'teacher') {
            return (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Thông tin giảng viên
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Mã giảng viên
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.teacher_code || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Chức vụ
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.position || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Học vị
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.degree || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Chuyên môn
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.specialization || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Khoa
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.faculty?.name || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Bộ môn
                            </label>
                            <input
                                type="text"
                                value={roleSpecificData.department?.name || ''}
                                className="border rounded-md px-3 py-2 bg-gray-100"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <form onSubmit={handleSubmit}>
                <ProfileHeader
                    editing={editing}
                    onEditClick={handleEditClick}
                    onCancelEdit={handleCancelEdit}
                    loading={loading}
                />

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PersonalInfoForm
                            user={user}
                            editing={editing}
                            onChange={handleChange}
                        />

                        <div className="space-y-4">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Giới tính
                                </label>
                                <select
                                    name="gender"
                                    value={user.gender}
                                    onChange={handleChange}
                                    className={`border rounded-md px-3 py-2 ${!editing ? 'bg-gray-100' : 'border-gray-300'}`}
                                    disabled={!editing}
                                >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={user.date_of_birth}
                                    onChange={handleChange}
                                    className={`border rounded-md px-3 py-2 ${!editing ? 'bg-gray-100' : 'border-gray-300'}`}
                                    disabled={!editing}
                                />
                            </div>

                            <AvatarUpload
                                user={user}
                                loading={loading}
                                editing={editing}
                                onAvatarChange={handleChange}
                            />
                            <ChangePassword editing={editing} />
                        </div>
                    </div>
                     {getUser()?.role === 'admin' && (
                        <OrganizationInfo
                            organization={organization}
                            loadingOrg={loadingOrg}
                        />
                    )}
                    {/* Role-specific information section */}
                    {renderRoleInfo()}
                </div>
            </form>
        </div>
    );
};

export default Profile;