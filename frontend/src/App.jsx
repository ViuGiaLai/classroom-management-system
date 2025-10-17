import { LoginPage } from './components/LoginPage';
import AdminLayout from './components/Admin/Layout';
import Dashboard from './components/Admin/Dashboard';

function App() {
  // Temporarily render Admin dashboard; switch to routing later
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}

export default App;