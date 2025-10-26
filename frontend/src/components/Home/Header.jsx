import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItem = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const navContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Index() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsNavCollapsed(false);
      } else {
        setIsNavCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavToggle = () => {
    if (isMobile) {
      setIsNavCollapsed(!isNavCollapsed);
    }
  };

  return (
    <motion.nav 
      className="navbar navbar-expand-lg sticky-top bg-white border-bottom" 
      style={{ '--bs-bg-opacity': '0.8', backdropFilter: 'blur(10px)' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container">
        <motion.a 
          className="navbar-brand d-flex align-items-center" 
          href="#"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white" 
            style={{ width: '32px', height: '32px' }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="fw-bold">B</span>
          </motion.div>
          <motion.span 
            className="ms-2 text-primary fw-bold"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            Binary Bandits LMS
          </motion.span>
        </motion.a>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={handleNavToggle}
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <AnimatePresence>
          <div className={`${isNavCollapsed && isMobile ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <motion.ul 
              className="navbar-nav mx-auto mb-2 mb-lg-0"
              variants={navContainer}
              initial="hidden"
              animate="show"
            >
              {['Trang chủ', 'Tính năng', 'Giới thiệu', 'Liên hệ'].map((item, index) => (
                <motion.li 
                  key={item} 
                  className="nav-item"
                  variants={navItem}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    className="nav-link px-3" 
                    href={`#${item === 'Trang chủ' ? '' : item.toLowerCase().replace(' ', '')}`} 
                    onClick={handleNavToggle}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          
          <motion.div 
            className="d-flex gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              className="btn btn-outline-primary me-2"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(13, 110, 253, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Đăng nhập
            </motion.button>
            <motion.button 
              className="btn btn-primary shadow-sm"
              onClick={() => navigate('/register')}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 15px rgba(13, 110, 253, 0.7)',
                transition: { yoyo: Infinity, duration: 0.5 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              Đăng ký
            </motion.button>
          </motion.div>
          </div>
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}