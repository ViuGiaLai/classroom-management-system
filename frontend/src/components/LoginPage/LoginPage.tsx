import { useState } from 'react';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import type { LoginPageProps } from './types';
import { mockLoginPageData } from './loginPageMockData';
// @ts-ignore
import api from '../../api/axiosConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage({
  onLogin,
  onForgotPassword,
  onTermsClick,
  onPrivacyClick
}: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    setIsLoading(true); // Bắt đầu loading

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;

      localStorage.setItem('token', token);
      console.log('Login successful, token:', token);

      // toast.success('Đăng nhập thành công!', {
      //   position: 'top-center',
      //   autoClose: 2000,
      // });

      if (onLogin) onLogin(email, password);

      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1500);

    } catch (error: any) {
      console.error('Login failed:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status === 404) {
          toast.error('Tài khoản không tồn tại!', { position: 'top-center', autoClose: 2000 });
        } else if (status === 401) {
          toast.error('Sai mật khẩu, vui lòng thử lại!', { position: 'top-center', autoClose: 2000 });
        } else {
          const message = data?.message || 'Lỗi không xác định từ máy chủ. Vui lòng thử lại!';
          toast.error(message, { position: 'top-center', autoClose: 2000 });
        }
      } else if (error.request) {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!', { position: 'top-center', autoClose: 2000 });
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!', { position: 'top-center', autoClose: 2000 });
      }
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) onForgotPassword();
  };

  const handleTermsClick = () => {
    if (onTermsClick) onTermsClick();
  };

  const handlePrivacyClick = () => {
    if (onPrivacyClick) onPrivacyClick();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen position-relative">
      <LeftPanel
        stats={mockLoginPageData.leftPanelStats}
        features={mockLoginPageData.features}
      />
      <RightPanel
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        onTermsClick={handleTermsClick}
        onPrivacyClick={handlePrivacyClick}
      />

      {/* Spinner nằm giữa màn hình khi loading */}
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
