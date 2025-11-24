import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateProfile } from '@/api/userApi';
import { getOrganizationById } from '@/api/organizationApi';
import { getUser } from '@/utils/auth';
import { format } from 'date-fns';
import api from '@/api/axiosConfig';

// Import components
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoForm from './components/PersonalInfoForm';
import AvatarUpload from './components/AvatarUpload';
import OrganizationInfo from './components/OrganizationInfo';
import ChangePassword from './components/ChangePassword';

const Profile = () => {
    const [user, setUser] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        gender: 'male',
        date_of_birth: '',
        avatar_url: ''  
    });

    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingOrg, setLoadingOrg] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = () => {
        const currentUser = getUser();
        // console.log('Current user from localStorage:', currentUser);

        if (currentUser) {
            setUser({
                full_name: currentUser.full_name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                gender: currentUser.gender || 'male',
                date_of_birth: currentUser.date_of_birth
                    ? format(new Date(currentUser.date_of_birth), 'yyyy-MM-dd')
                    : '',
                avatar_url: currentUser.avatar_url || ''  
            });

            if (currentUser.role === 'admin' && currentUser.organization_id) {
                loadOrganizationData(currentUser.organization_id);
            }
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
            // Gửi dữ liệu dạng JSON 
            const dataToUpdate = {
                full_name: user.full_name,
                phone: user.phone,
                address: user.address,
                gender: user.gender,
                date_of_birth: user.date_of_birth,
                avatar_url: user.avatar_url  
            };

            const response = await updateProfile(dataToUpdate);

            updateLocalStorage(response.data.user);

            loadUserData();

            setEditing(false);
            toast.success('Cập nhật thông tin thành công');
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const updateLocalStorage = (updatedUserData) => {
        const currentUser = getUser();

        const newUserData = {
            ...currentUser,
            full_name: updatedUserData.full_name || currentUser.full_name,
            phone: updatedUserData.phone || currentUser.phone,
            address: updatedUserData.address || currentUser.address,
            gender: updatedUserData.gender || currentUser.gender,
            date_of_birth: updatedUserData.date_of_birth || currentUser.date_of_birth,
            avatar_url: updatedUserData.avatar_url || currentUser.avatar_url  
        };

        // console.log('Updating localStorage with:', newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    const handleEditClick = () => setEditing(true);

    const handleCancelEdit = () => {
        loadUserData();
        setEditing(false);
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
                </div>
            </form>
        </div>
    );
};

export default Profile;