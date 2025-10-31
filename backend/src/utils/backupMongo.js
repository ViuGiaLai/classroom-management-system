const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function backupMongo() {
  const mongoURI = process.env.MONGO_URI;
  
  const dbName = 'binary-bandits';

  const backupDir = path.join(__dirname, '../../backup');
  const backupPath = path.join(backupDir, `${dbName}-backup-${Date.now()}`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Lệnh mongodump giống cmd
  const cmd = `mongodump --uri="${mongoURI}" --out="${backupPath}"`;

  // lệnh để khôi phục dữ liệu
  // const RestorePath = "D:/LapTrinhMaNguon_2/classroom-management-system/backend/backup/binary-bandits-backup-1761832463235";
  // const cmd = `mongorestore --uri="${mongoURI}" "${RestorePath}" --drop`;
  
  // Chạy terminal 
  // mongorestore --uri="mongodb+srv://binary-bandits:Binary%40Bandits2025@cluster0.xhzm6dl.mongodb.net/binary-bandits" "D:\LapTrinhMaNguon_2\classroom-management-system\backend\backup\binary-bandits-backup-1761832463235" --drop

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(` Backup lỗi: ${err.message}`);
      console.error(stderr);
      return;
    }
    console.log(` Backup MongoDB thành công!Lưu tại: ${backupPath}`);
  });
}

module.exports = backupMongo;
