import { useState } from 'react';
import { LeftPanel } from '../LoginPage/LeftPanel';
import { RightPanel } from './RightPanel';
import type { LoginPageProps } from '../LoginPage/types';
import { mockLoginPageData } from '../LoginPage/loginPageMockData';
// @ts-ignore
import api from '../../api/axiosConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';

export default function RegisterPage({
  onTermsClick,
  onPrivacyClick
}: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (formData: {
    org_name: string;
    org_email: string;
    org_phone: string;
    org_address: string;
    description: string;
    admin_name: string;
    admin_email: string;
    admin_password: string;
  }) => {
    console.log('Register attempt:', formData);
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      console.log('Full register response:', response);
      const { token, user } = response.data || {};
      const userId = user?.id || user?._id;

      if (!userId) {
        toast.warning('Đăng ký nhận được phản hồi nhưng chưa xác nhận lưu vào DB. Kiểm tra server.', {
          position: 'top-center',
          autoClose: 4000,
        });
        if (token) localStorage.setItem('token', token);
        setIsLoading(false);
        return;
      }

      if (token) localStorage.setItem('token', token);
      toast.success('Đăng ký thành công!', { position: 'top-center', autoClose: 2000 });

      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
    } catch (error: any) {
      console.error('Register failed:', error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error(data?.message || 'Email tổ chức hoặc admin đã tồn tại!', { position: 'top-center', autoClose: 3000 });
        } else {
          toast.error(data?.message || 'Đã xảy ra lỗi khi đăng ký!', { position: 'top-center', autoClose: 3000 });
        }
      } else if (error.request) {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!', { position: 'top-center', autoClose: 3000 });
      } else {
        toast.error('Đã xảy ra lỗi không xác định. Vui lòng thử lại!', { position: 'top-center', autoClose: 3000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClick = () => { if (onTermsClick) onTermsClick(); };
  const handlePrivacyClick = () => { if (onPrivacyClick) onPrivacyClick(); };

  return (
    <div className="flex flex-col md:flex-row min-h-screen position-relative">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#EEF6FF', // very light blue
            color: '#0B61D0',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            maxWidth: '320px'
          },
          success: {
            style: { background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }
          },
          error: {
            style: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }
          }
        }}
      />

      <LeftPanel
        stats={mockLoginPageData.leftPanelStats}
        features={mockLoginPageData.features}
      />

      <RightPanel
        onRegister={handleRegister}
        onTermsClick={handleTermsClick}
        onPrivacyClick={handlePrivacyClick}
      />

      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: 'rgba(255,255,255,0.7)', zIndex: 9999 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
