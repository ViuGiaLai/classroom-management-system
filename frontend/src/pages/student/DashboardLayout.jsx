import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Topbar from '../Admin/Topbar';

const { Content } = Layout;

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: 'all 0.2s',
          minHeight: '100vh',
        }}
      >
        <Topbar />

        <Content style={{
          margin: '16px 16px 0',
          padding: 24,
          minHeight: 280,
          background: '#fff',
          borderRadius: 8,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}