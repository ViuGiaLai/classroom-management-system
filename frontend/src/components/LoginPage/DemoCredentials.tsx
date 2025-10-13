import type { DemoCredentialsProps } from './types';

export function DemoCredentials({ accounts, password }: DemoCredentialsProps) {
  return (
    <div className="bg-info-bg rounded-lg p-4">
      <p className="text-gray-700 font-semibold text-base mb-2">Tài khoản demo:</p>
      <div className="space-y-1">
        {accounts.map((account, index) => (
          <p key={index} className="text-base font-semibold text-black">
            {account.role}: {account.email}
          </p>
        ))}
        <p className="text-base font-semibold text-black">Mật khẩu: {password}</p>
      </div>
    </div>
  );
}