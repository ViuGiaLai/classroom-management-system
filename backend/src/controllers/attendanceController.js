const Attendance = require('../models/attendanceModel');

// Thêm điểm danh
exports.createAttendance = async (req, res) => {
  try {
    const { class_id, student_id, date, status, note } = req.body;

    const existing = await Attendance.findOne({ class_id, student_id, date });
    if (existing)
      return res.status(400).json({ message: 'Attendance already recorded for this student on this date' });

    const record = await Attendance.create({
      class_id,
      student_id,
      date,
      status,
      note,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách điểm danh theo lớp + ngày
exports.getAttendanceByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    const filter = { class_id: classId };
    if (date) filter.date = new Date(date);

    const records = await Attendance.find(filter)
      .populate('student_id', 'full_name email')
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái điểm danh
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const updated = await Attendance.findByIdAndUpdate(
      id,
      { status, note },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Attendance record not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bản ghi điểm danh
exports.deleteAttendance = async (req, res) => {
  try {
    const deleted = await Attendance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
