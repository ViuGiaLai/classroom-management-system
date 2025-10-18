import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import type { LoginPageProps } from './types';
import { mockLoginPageData } from './loginPageMockData';
import api from '../../api/axiosConfig';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage({
  onLogin,
  onForgotPassword,
  onTermsClick,
  onPrivacyClick
}: LoginPageProps) {
  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Login successful, token:', token);
      if (onLogin) {
        onLogin(email, password);
      }
      window.location.href = '/admin/dashboard'; // Chuyển hướng đến trang quản trị
    } catch (error: any) {
      console.error('Login failed:', error);

      if (error.response && error.response.status === 401) {
        toast.error('Sai tài khoản hoặc mật khẩu!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const handleTermsClick = () => {
    console.log('Terms clicked');
    if (onTermsClick) {
      onTermsClick();
    }
  };

  const handlePrivacyClick = () => {
    console.log('Privacy clicked');
    if (onPrivacyClick) {
      onPrivacyClick();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
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

      <ToastContainer />
    </div>
  );
}
