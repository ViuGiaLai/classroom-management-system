import type { TermsTextProps } from './types';

export function TermsText({ onTermsClick, onPrivacyClick }: TermsTextProps) {
  return (
    <p className="tiny-text text-black text-center">
      Bằng cách đăng nhập, bạn đồng ý với{' '}
      <button
        type="button"
        onClick={onTermsClick}
        className="text-link hover:underline"
      >
        Điều khoản sử dụng
      </button>{' '}
      và{' '}
      <button
        type="button"
        onClick={onPrivacyClick}
        className="text-link hover:underline"
      >
        Chính sách bảo mật
      </button>
    </p>
  );
}