const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const Student = require('./src/models/studentModel');
const Teacher = require('./src/models/teacherModel');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is undefined! Check your .env file.');
    process.exit(1);
}

async function syncUsers() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        const studentUsers = await User.find({ role: 'student' });
        console.log(`Found ${studentUsers.length} student users`);

        for (const user of studentUsers) {
            const existingStudent = await Student.findOne({ user_id: user._id });

            if (!existingStudent) {
                const student_code = user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-6);

                await Student.create({
                    user_id: user._id,
                    student_code,
                    organization_id: user.organization_id,
                    status: 'studying',
                    year_of_admission: new Date().getFullYear(),
                    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
                });

                console.log(`✓ Created student: ${user.email} - ${student_code}`);
            }
        }

        // Sync teachers
        const teacherUsers = await User.find({ role: 'teacher' });
        console.log(`Found ${teacherUsers.length} teacher users`);

        for (const user of teacherUsers) {
            const existingTeacher = await Teacher.findOne({ user_id: user._id });

            if (!existingTeacher) {
                const teacher_code = 'TC' + user.email.split('@')[0].toUpperCase() + Date.now().toString().slice(-4);

                await Teacher.create({
                    user_id: user._id,
                    teacher_code,
                    organization_id: user.organization_id,
                    position: 'Giảng viên',
                });

                console.log(`✓ Created teacher: ${user.email} - ${teacher_code}`);
            }
        }

        console.log('✅ Sync completed!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

syncUsers();
