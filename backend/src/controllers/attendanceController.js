const Attendance = require('../models/attendanceModel');
const Class = require('../models/classModel');

// Helper function to update class enrollment count
const updateClassEnrollment = async (class_id, organization_id) => {
  try {
    const uniqueStudents = await Attendance.distinct('student_id', {
      class_id,
      organization_id
    });
    
    await Class.findByIdAndUpdate(class_id, {
      current_enrollment: uniqueStudents.length
    });
  } catch (error) {
    console.error('Error updating class enrollment:', error);
  }
};

// [POST] Thêm điểm danh — thuộc tổ chức
exports.createAttendance = async (req, res) => {
  try {
    const { class_id, student_id, date, status, note } = req.body;
    const organization_id = req.user.organization_id;

    const existing = await Attendance.findOne({
      class_id,
      student_id,
      date,
      organization_id,
    });

    if (existing) {
      return res.status(400).json({
        message: 'Attendance already recorded for this student on this date',
      });
    }

    const record = await Attendance.create({
      class_id,
      student_id,
      date,
      status,
      note,
      organization_id,
    });

    // Update class enrollment count
    await updateClassEnrollment(class_id, organization_id);

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] Lấy danh sách điểm danh theo lớp + ngày — thuộc tổ chức
exports.getAttendanceByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;
    const organization_id = req.user.organization_id;

    const filter = { class_id: classId, organization_id };
    if (date) filter.date = new Date(date);

    const records = await Attendance.find(filter)
      .populate('student_id', 'full_name email student_code')
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] Cập nhật trạng thái điểm danh — thuộc tổ chức
exports.updateAttendance = async (req, res) => {
  try {
    const { status, note } = req.body;
    const organization_id = req.user.organization_id;

    const updated = await Attendance.findOneAndUpdate(
      { _id: req.params.id, organization_id },
      { status, note },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Attendance record not found in your organization' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] Xóa bản ghi điểm danh — thuộc tổ chức
exports.deleteAttendance = async (req, res) => {
  try {
    const organization_id = req.user.organization_id;

    const deleted = await Attendance.findOneAndDelete({
      _id: req.params.id,
      organization_id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Record not found in your organization' });
    }

    // Update class enrollment count
    await updateClassEnrollment(deleted.class_id, organization_id);

    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};