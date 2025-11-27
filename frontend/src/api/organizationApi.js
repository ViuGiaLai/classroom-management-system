import api from './axiosConfig';

// Lấy danh sách tổ chức
export const getOrganizations = () => {
  return api.get('/organizations');
};

// Lấy thông tin tổ chức theo ID
export const getOrganizationById = (id) => {
  return api.get(`/organizations/${id}`);
};

// Cập nhật thông tin tổ chức
export const updateOrganization = (id, data) => {
  return api.put(`/organizations/${id}`, data);
};

export default {
  getOrganizations,
  getOrganizationById,
  updateOrganization
};
