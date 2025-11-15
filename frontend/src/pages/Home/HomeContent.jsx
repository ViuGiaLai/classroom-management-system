import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

// Định nghĩa animation cho container, các phần tử con sẽ xuất hiện
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.8
    }
  }
};

// Component này giúp tạo hiệu ứng khi scroll đến phần tương ứng
const AnimatedSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('show');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={controls}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

import { 
  ArrowRight, Users, FileText, CheckSquare, Bell, 
  MessageSquare, Cloud, GraduationCap, BookOpen, 
  Shield, Mail, MapPin, Globe, Send 
} from 'lucide-react';

const Content = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  // onclick navigate to login page
  const navigate = useNavigate();

  return (
    <motion.main 
      className="min-vh-100"
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <motion.section 
        className="position-relative overflow-hidden pt-3 py-lg-4 py-xl-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-br from-primary/10 to-info/10 opacity-50"></div>
        <div className="container position-relative py-5 py-lg-6 py-xl-7">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.h1 
                  className="h2 fw-bold mb-3" 
                  style={{ fontSize: 'calc(1.5rem + 1vw)' }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Quản lý lớp học <motion.span 
                    className="text-primary"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 100,
                      delay: 0.4
                    }}
                  >
                    dễ dàng
                  </motion.span>
                </motion.h1>
                <motion.h2 
                  className="h4 fw-bold text-secondary mb-3" 
                  style={{ fontSize: 'calc(1.2rem + 0.5vw)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Dạy và học hiệu quả hơn cùng <span className="text-primary">Binary LMS</span>
                </motion.h2>
                <motion.p 
                  className="text-muted mb-4" 
                  style={{ fontSize: '1rem' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Hệ thống quản lý lớp học giúp giáo viên và sinh viên theo dõi bài tập, điểm danh, nộp bài và trao đổi trong thời gian thực.
                </motion.p>
              </motion.div>

              <motion.div 
                className="d-flex flex-wrap gap-3 mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.button 
                  className="btn btn-primary btn-lg d-flex align-items-center gap-2 shadow"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 10px 20px rgba(13, 110, 253, 0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                >
                  Bắt đầu ngay
                  <motion.span
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'easeInOut'
                    }}
                  >
                    <ArrowRight className="fs-5" />
                  </motion.span>
                </motion.button>
                <motion.button 
                  className="btn btn-outline-warning btn-lg"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(228, 181, 26, 0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập
                </motion.button>
              </motion.div>

              <motion.div 
                className="d-flex flex-wrap gap-4 gap-lg-5 pt-3"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {[
                  { number: '1000+', label: 'Giáo viên', color: 'primary' },
                  { number: '5000+', label: 'Học viên', color: 'info' },
                  { number: '500+', label: 'Lớp học', color: 'primary' }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center"
                    variants={item}
                    whileHover={{ y: -5 }}
                  >
                    <div 
                      className={`fw-bold text-${stat.color}`} 
                      style={{ fontSize: '1.75rem' }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-muted small">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div 
              className="col-lg-6 position-relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: {
                  type: 'spring',
                  stiffness: 50,
                  delay: 0.3
                }
              }}
            >
              <motion.div 
                className="position-relative rounded-4 overflow-hidden shadow-lg"
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6bf0a59c97f7fb0b5b3ac9dd4e9b97426e0560ea?width=1320"
                  alt="Students collaborating with technology"
                  className="img-fluid w-100"
                  initial={{ scale: 1.1 }}
                  animate={{ 
                    scale: 1,
                    transition: { duration: 1, ease: 'easeOut' }
                  }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-br from-primary/20 to-info/20"></div>
              </motion.div>
              <motion.div 
                className="position-absolute top-0 end-0 w-75 h-75 bg-primary bg-opacity-20 rounded-circle" 
                style={{ filter: 'blur(3rem)', zIndex: -1 }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
              <motion.div 
                className="position-absolute bottom-0 start-0 w-75 h-75 bg-info bg-opacity-20 rounded-circle" 
                style={{ filter: 'blur(3rem)', zIndex: -1 }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: 1
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-5 py-lg-6 py-xl-7 bg-light bg-opacity-30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              staggerChildren: 0.1
            }
          }
        }}
      >
        <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="h2 fw-bold mb-3">
              Tính năng <span className="text-primary">nổi bật</span>
            </h2>
            <p className="text-muted mx-auto lead" style={{ maxWidth: '700px' }}>
              Hệ thống quản lý học tập toàn diện với các tính năng mạnh mẽ
            </p>
          </motion.div>

          <div className="row g-4">
            {[
              {
                icon: Users,
                title: "Quản lý lớp học",
                description: "Tạo, cập nhật và phân công giảng viên cho từng lớp"
              },
              {
                icon: FileText,
                title: "Bài tập & Nộp bài",
                description: "Sinh viên dễ dàng nộp bài, giáo viên chấm điểm trực tiếp"
              },
              {
                icon: CheckSquare,
                title: "Theo dõi điểm danh",
                description: "Ghi nhận chuyên cần nhanh chóng qua khuôn mặt hoặc thủ công"
              },
              {
                icon: Bell,
                title: "Thông báo tức thì",
                description: "Cập nhật thông tin mới đến học viên qua real-time notification"
              },
              {
                icon: MessageSquare,
                title: "Thảo luận nhóm",
                description: "Học viên và giáo viên có thể trao đổi ngay trong lớp học"
              },
              {
                icon: Cloud,
                title: "Lưu trữ an toàn",
                description: "Tài liệu được lưu trên cloud storage"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="col-md-6 col-lg-4"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.5
                    }
                  }
                }}
              >
                <motion.div 
                  className="h-100 p-4 rounded-3 border bg-white shadow-sm hover-shadow transition-all"
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="d-inline-flex align-items-center justify-content-center p-2 bg-primary bg-opacity-10 rounded-3 text-primary mb-3">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="h5 fw-bold mb-2">{feature.title}</h3>
                  <p className="text-muted mb-0">{feature.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Target Audience Section */}
      <motion.section 
        id="about" 
        className="py-5 py-lg-6 py-xl-7 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.2
            }
          }
        }}
      >
        <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="display-4 fw-bold mb-3">
              Dành cho <span className="text-primary">ai?</span>
            </h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Binary Bandits LMS phục vụ mọi thành viên trong hệ sinh thái giáo dục
            </p>
          </motion.div>

          <div className="row g-4 justify-content-center">
            {[
              {
                icon: GraduationCap,
                title: "Giáo viên",
                description: "Quản lý lớp học, tạo bài tập, chấm điểm và theo dõi tiến độ học tập của sinh viên một cách dễ dàng.",
                color: "primary"
              },
              {
                icon: BookOpen,
                title: "Sinh viên",
                description: "Theo dõi bài tập, nộp bài trực tuyến, kiểm tra điểm danh và nhận thông báo từ giáo viên ngay lập tức.",
                color: "info"
              },
              {
                icon: Shield,
                title: "Quản trị viên",
                description: "Giám sát toàn bộ hệ thống, quản lý người dùng, phân quyền và theo dõi hoạt động của nền tảng.",
                color: "primary"
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="col-md-4"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                <motion.div 
                  className="h-100 p-4 rounded-4 border bg-white shadow-sm text-center transition-all hover:shadow-lg"
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className={`d-inline-flex align-items-center justify-content-center p-3 bg-${item.color} bg-opacity-10 rounded-4 text-${item.color} mb-3`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="h4 fw-bold mb-3">{item.title}</h3>
                  <p className="text-muted mb-0">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact" 
        className="py-5 py-lg-6 py-xl-7 bg-light bg-opacity-30"
        variants={fadeIn}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">
                Liên hệ <span className="text-primary">với chúng tôi</span>
              </h2>
              <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '700px' }}>
                Có câu hỏi? Chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row g-4 mb-5">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "support@binarylms.vn"
                  },
                  {
                    icon: MapPin,
                    label: "Địa chỉ",
                    value: "Gia Lai, Việt Nam"
                  },
                  {
                    icon: Globe,
                    label: "Website",
                    value: "www.binarylms.vn"
                  }
                ].map((contact, index) => (
                  <div key={index} className="col-md-4">
                    <div className="h-100 p-3 rounded-3 border bg-white shadow-sm text-center">
                      <div className="d-inline-flex align-items-center justify-content-center p-2 bg-primary bg-opacity-10 rounded-3 text-primary mb-2">
                        <contact.icon className="fs-5" />
                      </div>
                      <div className="text-muted small mb-1">{contact.label}</div>
                      <div className="fw-semibold small">{contact.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3 border p-3 p-lg-4 shadow">
                <h3 className="h4 fw-bold text-center mb-3" style={{fontSize: '1.5rem'}}>
                  Gửi tin nhắn cho chúng tôi
                </h3>
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label small">Họ và tên</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{fontSize: '0.95rem'}}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label small">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{fontSize: '0.95rem'}}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label small">Nội dung</label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows={4}
                      placeholder="Nhập nội dung tin nhắn..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      style={{fontSize: '0.95rem'}}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                    style={{fontSize: '0.95rem'}}
                  >
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default Content;
