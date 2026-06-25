import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6 font-medium">
        {user?.role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/admin/users"     className="hover:underline">Users</Link>
            <Link to="/admin/stores"    className="hover:underline">Stores</Link>
          </>
        )}
        {user?.role === 'USER' && (
          <>
            <Link to="/stores" className="hover:underline">Stores</Link>
            <Link to="/update-password" className="hover:underline">Change Password</Link>
          </>
        )}
        {user?.role === 'STORE_OWNER' && (
          <>
            <Link to="/my-store/dashboard" className="hover:underline">My Store</Link>
            <Link to="/update-password"    className="hover:underline">Change Password</Link>
          </>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;