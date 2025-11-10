import { useState } from 'react';

interface RegisterFormProps {
  onSubmit: (formData: {
    org_name: string;
    org_email: string;
    org_phone: string;
    org_address: string;
    description: string;
    admin_name: string;
    admin_email: string;
    admin_password: string;
  }) => void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [description, setDescription] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [orgNameError, setOrgNameError] = useState('');
  const [orgEmailError, setOrgEmailError] = useState('');
  const [orgPhoneError, setOrgPhoneError] = useState('');
  const [orgAddressError, setOrgAddressError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [adminNameError, setAdminNameError] = useState('');
  const [adminEmailError, setAdminEmailError] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmailField = (value: string, setError: (s: string) => void) => {
    if (!value) {
      return false;
    }
    if (!emailRegex.test(value)) {
      return false;
    }
    setError('');
    return true;
  };

  const validateRequired = (value: string, setError: (s: string) => void, label = 'Trường này') => {
    if (!value) {
      return false;
    }
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return false;
    }
    if (value.length < 6) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const v1 = validateRequired(orgName, setOrgNameError, 'Tên tổ chức');
    const v2 = validateEmailField(orgEmail, setOrgEmailError);
    const v3 = validateRequired(orgPhone, setOrgPhoneError, 'Số điện thoại');
    const v4 = validateRequired(orgAddress, setOrgAddressError, 'Địa chỉ');
    const v5 = validateRequired(description, setDescriptionError, 'Mô tả');
    const v6 = validateRequired(adminName, setAdminNameError, 'Họ tên admin');
    const v7 = validateEmailField(adminEmail, setAdminEmailError);
    const v8 = validatePassword(adminPassword);

    if (v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8) {
      onSubmit({
        org_name: orgName,
        org_email: orgEmail,
        org_phone: orgPhone,
        org_address: orgAddress,
        description,
        admin_name: adminName,
        admin_email: adminEmail,
        admin_password: adminPassword,
      });
    }
  };

  const isFormValid =
    orgName &&
    orgEmail &&
    orgPhone &&
    orgAddress &&
    description &&
    adminName &&
    adminEmail &&
    adminPassword &&
    !orgNameError &&
    !orgEmailError &&
    !orgPhoneError &&
    !orgAddressError &&
    !descriptionError &&
    !adminNameError &&
    !adminEmailError &&
    !adminPasswordError;

  const inputBase = (hasError: string) =>
    `w-full px-3 py-2 rounded-lg border text-sm ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } body-text focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-transparent`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Tên tổ chức</label>
        <input
          value={orgName}
          onChange={e => { setOrgName(e.target.value); if (orgNameError) validateRequired(e.target.value, setOrgNameError, 'Tên tổ chức'); }}
          onBlur={() => validateRequired(orgName, setOrgNameError, 'Tên tổ chức')}
          placeholder="VD: Trường Đại học ABC"
          className={inputBase(orgNameError)}
        />
        {orgNameError && <p className="text-red-500 text-xs mt-1">{orgNameError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Email tổ chức</label>
          <input
            value={orgEmail}
            onChange={e => { setOrgEmail(e.target.value); if (orgEmailError) validateEmailField(e.target.value, setOrgEmailError); }}
            onBlur={() => validateEmailField(orgEmail, setOrgEmailError)}
            placeholder="contact@example.edu.vn"
            className={inputBase(orgEmailError)}
            type="email"
          />
          {orgEmailError && <p className="text-red-500 text-xs mt-1">{orgEmailError}</p>}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Số điện thoại</label>
          <input
            value={orgPhone}
            onChange={e => { setOrgPhone(e.target.value); if (orgPhoneError) validateRequired(e.target.value, setOrgPhoneError, 'Số điện thoại'); }}
            onBlur={() => validateRequired(orgPhone, setOrgPhoneError, 'Số điện thoại')}
            placeholder="0123456789"
            className={inputBase(orgPhoneError)}
          />
          {orgPhoneError && <p className="text-red-500 text-xs mt-1">{orgPhoneError}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Địa chỉ</label>
        <input
          value={orgAddress}
          onChange={e => { setOrgAddress(e.target.value); if (orgAddressError) validateRequired(e.target.value, setOrgAddressError, 'Địa chỉ'); }}
          onBlur={() => validateRequired(orgAddress, setOrgAddressError, 'Địa chỉ')}
          placeholder="Số 1, Đường ABC, Quận XYZ, TP. HCM"
          className={inputBase(orgAddressError)}
        />
        {orgAddressError && <p className="text-red-500 text-xs mt-1">{orgAddressError}</p>}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Mô tả tổ chức</label>
        <textarea
          value={description}
          onChange={e => { setDescription(e.target.value); if (descriptionError) validateRequired(e.target.value, setDescriptionError, 'Mô tả'); }}
          onBlur={() => validateRequired(description, setDescriptionError, 'Mô tả')}
          placeholder="Mô tả ngắn gọn về tổ chức của bạn..."
          rows={2}
          className={inputBase(descriptionError)}
        />
        {descriptionError && <p className="text-red-500 text-xs mt-1">{descriptionError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Họ tên admin</label>
          <input
            value={adminName}
            onChange={e => { setAdminName(e.target.value); if (adminNameError) validateRequired(e.target.value, setAdminNameError, 'Họ tên admin'); }}
            onBlur={() => validateRequired(adminName, setAdminNameError, 'Họ tên admin')}
            placeholder="Nguyễn Văn A"
            className={inputBase(adminNameError)}
          />
          {adminNameError && <p className="text-red-500 text-xs mt-1">{adminNameError}</p>}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Email admin</label>
          <input
            value={adminEmail}
            onChange={e => { setAdminEmail(e.target.value); if (adminEmailError) validateEmailField(e.target.value, setAdminEmailError); }}
            onBlur={() => validateEmailField(adminEmail, setAdminEmailError)}
            placeholder="admin@example.edu.vn"
            type="email"
            className={inputBase(adminEmailError)}
          />
          {adminEmailError && <p className="text-red-500 text-xs mt-1">{adminEmailError}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Mật khẩu</label>
        <div className="relative">
          <input
            value={adminPassword}
            onChange={e => { setAdminPassword(e.target.value); if (adminPasswordError) validatePassword(e.target.value); }}
            onBlur={() => validatePassword(adminPassword)}
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            className={inputBase(adminPasswordError)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
        {adminPasswordError && <p className="text-red-500 text-xs mt-1">{adminPasswordError}</p>}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          isFormValid ? 'bg-primary-blue hover:bg-primary-blue-dark text-white' : 'bg-gray-400 cursor-not-allowed text-white'
        }`}
      >
        Đăng ký
      </button>
    </form>
  );
}