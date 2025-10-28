const Request = require('../models/requestModel');

// [POST] Tạo yêu cầu mới — thuộc tổ chức
exports.createRequest = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const request = await Request.create({
      ...req.body,
      organization_id,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] Lấy danh sách yêu cầu — theo sinh viên hoặc tất cả trong tổ chức
exports.getRequests = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;
    const { student_id } = req.query;

    const filter = { organization_id };
    if (student_id) filter.student_id = student_id;

    const requests = await Request.find(filter).sort({ created_at: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Cập nhật trạng thái yêu cầu — thuộc tổ chức
exports.updateRequest = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const updated = await Request.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found in your organization' });
    }

    res.status(200).json({ message: 'Updated successfully', updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] Xóa yêu cầu — thuộc tổ chức
exports.deleteRequest = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Request.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Request not found in your organization' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

