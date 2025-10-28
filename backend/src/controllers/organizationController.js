const Organization = require('../models/organizationModel');

// [GET] /api/organizations - Lấy danh sách tổ chức
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [GET] /api/organizations/:id - Lấy tổ chức theo ID
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Không tìm thấy tổ chức' });
    }
    res.status(200).json(organization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// [PUT] /api/organizations/:id - Cập nhật tổ chức
exports.updateOrganization = async (req, res) => {
  try {
    const updated = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy tổ chức' });
    }
    res.status(200).json({ message: 'Đã cập nhật tổ chức', organization: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// [DELETE] /api/organizations/:id - Xóa tổ chức
exports.deleteOrganization = async (req, res) => {
  try {
    const deleted = await Organization.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy tổ chức' });
    }
    res.status(200).json({ message: 'Đã xóa tổ chức' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};