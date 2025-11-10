import { RegisterForm } from './RegisterForm';
import { TermsText } from '../LoginPage/TermsText';

interface RightPanelProps {
  onRegister: (formData: {
    org_name: string;
    org_email: string;
    org_phone: string;
    org_address: string;
    description: string;
    admin_name: string;
    admin_email: string;
    admin_password: string;
  }) => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export function RightPanel({
  onRegister,
  onTermsClick,
  onPrivacyClick,
}: RightPanelProps) {
  return (
    <div className="w-full md:w-1/2 min-h-screen bg-gray-50 p-6 md:p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-left">
          <h2 className="heading-large mb-2">Tạo tài khoản tổ chức </h2>
          <p className="body-text">Nhập thông tin tổ chức và tài khoản admin</p>
        </div>

        {/* Register Form */}
        <RegisterForm onSubmit={onRegister} />

        {/* Terms and Privacy */}
        <TermsText onTermsClick={onTermsClick} onPrivacyClick={onPrivacyClick} />
      </div>
    </div>
  );
}