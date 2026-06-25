import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UpdatePassword from './pages/shared/UpdatePassword';

// Auth
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import UsersList      from './pages/admin/UserList';
import UserDetail     from './pages/admin/UserDetail';
import AddUser        from './pages/admin/AddUser';
import AdminStores    from './pages/admin/StoreList';
import AddStore       from './pages/admin/AddStore';

// User
import UserStores  from './pages/user/StoreList';
import StoreDetail from './pages/user/StoreDetail';

// Store Owner
import OwnerDashboard from './pages/storeowner/Dashboard';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'ADMIN')       return <Navigate to="/admin/dashboard" />;
  if (user.role === 'USER')        return <Navigate to="/stores" />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/my-store/dashboard" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/"         element={<RoleRedirect />} />

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard"  element={<AdminDashboard />} />
          <Route path="/admin/users"      element={<UsersList />} />
          <Route path="/admin/users/new"  element={<AddUser />} />
          <Route path="/admin/users/:id"  element={<UserDetail />} />
          <Route path="/admin/stores"     element={<AdminStores />} />
          <Route path="/admin/stores/new" element={<AddStore />} />
        </Route>

        {/* Normal User */}
        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/stores"     element={<UserStores />} />
          <Route path="/stores/:id" element={<StoreDetail />} />
        </Route>

        {/* Store Owner */}
        <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
          <Route path="/my-store/dashboard" element={<OwnerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['USER', 'STORE_OWNER', 'ADMIN']} />}>
          <Route path="/update-password" element={<UpdatePassword />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;