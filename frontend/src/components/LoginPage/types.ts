export interface LoginPageProps {
  onLogin?: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}

export interface StatBadgeProps {
  count: string;
  label: string;
  icon?: React.ReactNode;
}

export interface FeatureCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export interface DemoAccountProps {
  role: string;
  email: string;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onForgotPassword?: () => void;
}

export interface DemoCredentialsProps {
  accounts: DemoAccountProps[];
  password: string;
}

export interface TermsTextProps {
  onTermsClick?: () => void;
  onPrivacyClick?: () => void;
}