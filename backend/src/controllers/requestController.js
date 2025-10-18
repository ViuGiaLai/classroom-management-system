const Request = require('../models/requestModel');

// Tạo yêu cầu mới
exports.createRequest = async (req, res) => {
  try {
    const request = await Request.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách yêu cầu (theo sinh viên hoặc tất cả)
exports.getRequests = async (req, res) => {
  try {
    const { student_id } = req.query;
    const where = student_id ? { student_id } : {};
    const requests = await Request.findAll({ where });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái (giáo vụ hoặc admin)
exports.updateRequest = async (req, res) => {
  try {
    const updated = await Request.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: 'Updated successfully', updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa yêu cầu
exports.deleteRequest = async (req, res) => {
  try {
    await Request.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
