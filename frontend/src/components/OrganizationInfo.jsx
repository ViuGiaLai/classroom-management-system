import React from 'react';

const OrganizationInfo = ({ organization, loadingOrg }) => {
  if (!organization) return null;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Thông tin tổ chức
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Tên tổ chức</p>
          <p className="text-gray-900">{organization.name}</p>
        </div>
        {organization.description && (
          <div>
            <p className="text-sm font-medium text-gray-500">Mô tả</p>
            <p className="text-gray-900">{organization.description}</p>
          </div>
        )}
        {organization.address && (
          <div>
            <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
            <p className="text-gray-900">{organization.address}</p>
          </div>
        )}
        {organization.email && (
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-gray-900">{organization.email}</p>
          </div>
        )}
        {organization.phone && (
          <div>
            <p className="text-sm font-medium text-gray-500">Điện thoại</p>
            <p className="text-gray-900">{organization.phone}</p>
          </div>
        )}
      </div>
      {loadingOrg && (
        <div className="mt-4 text-center text-gray-500">
          Đang tải thông tin tổ chức...
        </div>
      )}
    </div>
  );
};

export default OrganizationInfo;
