import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import type { LoginPageProps } from './types';
import { mockLoginPageData } from './loginPageMockData';

export function LoginPage({
  onLogin,
  onForgotPassword,
  onTermsClick,
  onPrivacyClick
}: LoginPageProps) {
  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    if (onLogin) {
      onLogin(email, password);
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
        demoAccounts={mockLoginPageData.demoAccounts}
        demoPassword={mockLoginPageData.demoPassword}
      />
    </div>
  );
}