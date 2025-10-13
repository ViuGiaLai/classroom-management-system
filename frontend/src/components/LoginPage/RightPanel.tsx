import { LoginForm } from './LoginForm';
import { DemoCredentials } from './DemoCredentials';
import { TermsText } from './TermsText';
import type { DemoAccountProps } from './types';

interface RightPanelProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
  demoAccounts: DemoAccountProps[];
  demoPassword: string;
}

export function RightPanel({
  onLogin,
  onForgotPassword,
  onTermsClick,
  onPrivacyClick,
  demoAccounts,
  demoPassword
}: RightPanelProps) {
  return (
    <div className="w-full md:w-1/2 min-h-screen bg-gray-50 p-6 md:p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Welcome Header */}
        <div className="text-left">
          <h2 className="heading-large mb-2">Chào mừng trở lại</h2>
          <p className="body-text">Đăng nhập để tiếp tục vào hệ thống</p>
        </div>

        {/* Login Form */}
        <LoginForm onSubmit={onLogin} onForgotPassword={onForgotPassword} />

        {/* Demo Credentials */}
        <DemoCredentials accounts={demoAccounts} password={demoPassword} />

        {/* Terms and Privacy */}
        <TermsText onTermsClick={onTermsClick} onPrivacyClick={onPrivacyClick} />
      </div>
    </div>
  );
}