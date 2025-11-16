const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const Student = require('../src/models/studentModel');
const Teacher = require('../src/models/teacherModel');
require('dotenv').config();

// Script để đồng bộ existing users với role='student'/'teacher' vào collections tương ứng
async function syncExistingUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classroom-management');
    console.log('Connected to MongoDB');

    // Lấy tất cả users có role='student' nhưng chưa có student record
    const studentUsers = await User.find({ role: 'student' });
    console.log(`Found ${studentUsers.length} users with role='student'`);

    for (const user of studentUsers) {
      // Kiểm tra xem student record đã tồn tại chưa
      const existingStudent = await Student.findOne({ user_id: user._id });
      
      if (!existingStudent) {
        // Tạo student record
        const student_code = user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-6);
        
        await Student.create({
          user_id: user._id,
          student_code,
          organization_id: user.organization_id,
          status: 'active',
          year_of_admission: new Date().getFullYear(),
          academic_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        });
        
        console.log(`Created student record for user: ${user.email} (${user.full_name})`);
      } else {
        console.log(`Student record already exists for user: ${user.email}`);
      }
    }

    // Lấy tất cả users có role='teacher' nhưng chưa có teacher record
    const teacherUsers = await User.find({ role: 'teacher' });
    console.log(`Found ${teacherUsers.length} users with role='teacher'`);

    for (const user of teacherUsers) {
      // Kiểm tra xem teacher record đã tồn tại chưa
      const existingTeacher = await Teacher.findOne({ user_id: user._id });
      
      if (!existingTeacher) {
        // Tạo teacher record
        const teacher_code = 'TC' + user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-4);
        
        await Teacher.create({
          user_id: user._id,
          teacher_code,
          organization_id: user.organization_id,
          position: 'Giảng viên',
        });
        
        console.log(`Created teacher record for user: ${user.email} (${user.full_name})`);
      } else {
        console.log(`Teacher record already exists for user: ${user.email}`);
      }
    }

    console.log('Sync completed successfully!');
    
  } catch (error) {
    console.error('Error during sync:', error);
  } finally {
    await mongoose.disconnect();
  }
}

syncExistingUsers();
