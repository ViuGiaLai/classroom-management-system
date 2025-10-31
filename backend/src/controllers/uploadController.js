const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // sẽ tự động lưu file vào cloudinary
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid'); // giúp tạo chuỗi ID ngẫu nhiên

// cấu hình ảnh thông thường
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'classroom_images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'classroom_avatars',
            public_id: `avatar_${uuidv4()}`,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            transformation: [
                { width: 200, height: 200, gravity: 'face', crop: 'thumb' } // 200x200
            ]
        };
    },
});

const uploadImage = multer({ // multer lấy file từ form field có tên trường là 'file'.
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
    }
}).single('file');

// middleware upload riêng cho avatar
const uploadAvatar = multer({ // multer lấy file từ form field có tên trường là 'avatar'.
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
        cb(null, true);
    }
}).single('avatar');

// Hàm xử lý Sau khi uploadImage hoàn thành
exports.uploadFile = [
    uploadImage,
    (req, res) => {
        // Nếu người dùng không gửi file nào
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Vui lòng chọn ảnh để tải lên' });
        }

        res.json({
            success: true,
            message: 'Tải ảnh lên thành công',
            url: req.file.path, // URL trên Cloudinary
            publicId: req.file.filename  // mã định danh để xóa/sửa
        });
    }
];

exports.uploadAvatar = async (req, res) => {
    uploadAvatar(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Có lỗi xảy ra khi tải lên ảnh đại diện'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn ảnh đại diện'
            });
        }

        try {
            const userId = req.user.id; 
            const user = await User.findById(userId);

            // Nếu có avatar cũ thì xóa đi
            if (user.avatar_url) {
                const matches = user.avatar_url.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
                if (matches && matches[1]) {
                    const publicId = matches[1]; 
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Cập nhật avatar mới
            user.avatar_url = req.file.path;
            await user.save();

            res.json({
                success: true,
                message: 'Cập nhật ảnh đại diện thành công',
                avatarUrl: user.avatar_url
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật ảnh đại diện:', error);
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi cập nhật ảnh đại diện'
            });
        }
    });
};
