require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Khởi tạo Supabase client
exports.supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

// Kiểm tra kết nối
(async () => {
  try {
    const { data, error } = await exports.supabase.storage.listBuckets();
    if (error) throw error;
    console.log('Kết nối Supabase Storage thành công!');
  } catch (error) {
    console.error('Lỗi kết nối Supabase:', error.message);
  }
})();
