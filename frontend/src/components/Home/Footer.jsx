import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

const AnimatedSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    triggerMargin: '0px 0px -100px 0px'
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

const Footer = () => {
  const socialIcons = [
    { icon: Facebook, color: 'hover:bg-blue-600 hover:text-white' },
    { icon: Twitter, color: 'hover:bg-sky-400 hover:text-white' },
    { icon: Linkedin, color: 'hover:bg-blue-700 hover:text-white' },
    { icon: Github, color: 'hover:bg-gray-800 hover:text-white' }
  ];

  const footerLinks = [
    {
      title: 'Sản phẩm',
      links: [
        { name: 'Tính năng', href: '#features' },
        { name: 'Giá cả', href: '#' },
        { name: 'Bảo mật', href: '#' }
      ]
    },
    {
      title: 'Công ty',
      links: [
        { name: 'Về chúng tôi', href: '#about' },
        { name: 'Blog', href: '#' },
        { name: 'Tuyển dụng', href: '#' }
      ]
    },
    {
      title: 'Hỗ trợ',
      links: [
        { name: 'Trung tâm trợ giúp', href: '#' },
        { name: 'Liên hệ', href: '#contact' },
        { name: 'Điều khoản', href: '#' }
      ]
    }
  ];
  return (
    <motion.footer 
      className="border-top bg-light bg-opacity-50 py-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8 }
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container">
        <div className="row g-5 mb-5">
          {/* Brand Column */}
          <motion.div 
            className="col-md-6 col-lg-3"
            variants={item}
          >
            <motion.div 
              className="d-flex align-items-center mb-3"
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className="me-2 d-flex align-items-center justify-content-center rounded-3 bg-primary text-white" 
                style={{width: '32px', height: '32px'}}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="fw-bold">B</span>
              </motion.div>
              <motion.span 
                className="text-primary fw-bold fs-5"
                whileHover={{ color: '#0d6efd' }}
              >
                Binary Bandits LMS
              </motion.span>
            </motion.div>
            
            <motion.p 
              className="text-muted small mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Hệ thống quản lý lớp học hiện đại cho giáo dục số
            </motion.p>
            
            <motion.div 
              className="d-flex gap-2"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {socialIcons.map(({ icon: Icon, color }, index) => (
                <motion.a 
                  key={index}
                  href="#"
                  className={`d-flex align-items-center justify-content-center rounded-3 bg-light text-dark text-decoration-none ${color}`}
                  style={{width: '40px', height: '40px'}}
                  variants={item}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { type: 'spring', stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="fs-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <motion.div 
              key={section.title} 
              className="col-6 col-md-3"
              variants={item}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <h5 className="mb-3 fw-semibold">{section.title}</h5>
              <ul className="list-unstyled">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    className="mb-2"
                    whileHover={{ x: 5 }}
                  >
                    <a 
                      href={link.href} 
                      className="text-muted text-decoration-none hover-primary"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="pt-4 border-top text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
          }}
          viewport={{ once: true }}
        >
          <p className="text-muted small mb-2">
            © {new Date().getFullYear()} Binary Bandits LMS. All rights reserved.
          </p>
          <p className="text-muted small mb-0">
             Gia Lai | support@binarybanditslms.vn | www.binarybanditslms.vn
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;