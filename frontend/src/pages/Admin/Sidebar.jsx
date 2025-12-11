import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  ApartmentOutlined,
  ReadOutlined,
  BookOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  BarChartOutlined,
  BellOutlined,
  SettingOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Tổng quan", path: "/admin/dashboard" },
  { key: "users", icon: <UserOutlined />, label: "Người dùng", path: "/admin/users" },
  { key: "students", icon: <TeamOutlined />, label: "Sinh viên", path: "/admin/students" },
  { key: "lecturers", icon: <SolutionOutlined />, label: "Giảng viên", path: "/admin/lecturers" },
  { key: "departments", icon: <ApartmentOutlined />, label: "Khoa", path: "/admin/departments" },
  { key: "majors", icon: <ReadOutlined />, label: "Chuyên ngành", path: "/admin/majors" },
  { key: "courses", icon: <BookOutlined />, label: "Học phần", path: "/admin/courses" },
  { key: "classes", icon: <ScheduleOutlined />, label: "Lớp học phần", path: "/admin/classes" },
  { key: "grades", icon: <FileTextOutlined />, label: "Quản lý điểm", path: "/admin/grades" },
  { key: "reports", icon: <BarChartOutlined />, label: "Báo cáo", path: "/admin/reports" },
  { key: "notifications", icon: <BellOutlined />, label: "Thông báo", path: "/admin/notifications" },
  { key: "settings", icon: <SettingOutlined />, label: "Cài đặt", path: "/admin/settings" },
  { key: "logs", icon: <HistoryOutlined />, label: "Nhật ký", path: "/admin/logs" },
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
            QUẢN TRỊ VIÊN
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
          fontSize: '15px', // Increased from default 14px
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
        }}
        onClick={() => onCollapse(!collapsed)}
      >
        {!collapsed && <span>Thu gọn</span>}
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          style: { fontSize: '16px' },
        })}
      </div>
    </Sider>
  );
}