import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  ReadOutlined,
  ApartmentOutlined,
  BookOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  SolutionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Tổng quan',
    path: '/student/dashboard',
  },
  {
    key: 'classes',
    icon: <ScheduleOutlined />,
    label: 'Lớp học của tôi',
    path: '/student/classes',
  },
  {
    key: 'materials',
    icon: <BookOutlined />,
    label: 'Tài liệu học tập',
    path: '/student/materials',
  },
  {
    key: 'assignments',
    icon: <FileTextOutlined />,
    label: 'Bài tập',
    path: '/student/assignments',
  },
  {
    key: 'exams',
    icon: <ReadOutlined />,
    label: 'Kiểm tra',
    path: '/student/exams',
  },
  {
    key: 'grades',
    icon: <BarChartOutlined />,
    label: 'Điểm số',
    path: '/student/grades',
  },
  {
    key: 'schedule',
    icon: <ScheduleOutlined />,
    label: 'Thời khóa biểu',
    path: '/student/schedule',
  },
  {
    key: 'notifications',
    icon: <BellOutlined />,
    label: 'Thông báo',
    path: '/student/notifications',
  }
];

export default function Sidebar({ collapsed, onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const selectedKey = menuItems.find(item =>
    location.pathname === item.path ||
    location.pathname.startsWith(`${item.path}/`)
  )?.key || 'dashboard';

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      collapsedWidth={80}
      style={{
        background: colorBgContainer,
        borderRight: '1px solid #f0f0f0',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 8,
        }}
      >
        {!collapsed ? (
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1890ff' }}>
            SINH VIÊN
          </h2>
        ) : (
          <div style={{ fontSize: '24px', color: '#1890ff' }}>
            <UserOutlined />
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{
          borderRight: 0,
          padding: '0 8px',
          height: 'calc(100% - 120px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          fontSize: '15px',
        }}
        items={menuItems.map(item => ({
          ...item,
          onClick: () => navigate(item.path),
        }))}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #f0f0f0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: colorBgContainer,
          fontSize: '15px',
        }}
        onClick={() => onCollapse(!collapsed)}
      >
        {!collapsed && <span>Thu gọn</span>}
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          style: { fontSize: '18px' },
        })}
      </div>
    </Sider>
  );
}