import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import SortableTable from '../../components/SortableTable';
import API from '../../api/axios';


const columns = [
  { key: 'name',    label: 'Name' },
  { key: 'email',   label: 'Email' },
  { key: 'address', label: 'Address' },
  {
    key: 'role',
    label: 'Role',
    render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold
        ${row.role === 'ADMIN'       ? 'bg-purple-100 text-purple-700' : ''}
        ${row.role === 'USER'        ? 'bg-blue-100 text-blue-700'     : ''}
        ${row.role === 'STORE_OWNER' ? 'bg-green-100 text-green-700'   : ''}
      `}>
        {row.role}
      </span>
    )
  },
];

const UsersList = () => {
  const navigate = useNavigate();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filters, setFilters] = useState({
    name: '', email: '', address: '', role: ''
  });

  const fetchUsers = useCallback(async (appliedFilters = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/users', { params: appliedFilters });
      setUsers(res.data.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    fetchUsers(clean);
  };

  const handleReset = () => {
    setFilters({ name: '', email: '', address: '', role: '' });
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <button
            onClick={() => navigate('/admin/users/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white 
              text-sm font-medium px-4 py-2 rounded-lg"
          >
            + Add User
          </button>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border p-4 mb-6 
            grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <input
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Filter by name"
            className="border border-gray-300 rounded-lg px-3 py-2 
              text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Filter by email"
            className="border border-gray-300 rounded-lg px-3 py-2 
              text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            placeholder="Filter by address"
            className="border border-gray-300 rounded-lg px-3 py-2 
              text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 
              text-sm outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>

          <div className="col-span-2 sm:col-span-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white 
                text-sm font-medium px-4 py-2 rounded-lg"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 
                text-sm font-medium px-4 py-2 rounded-lg"
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 
            rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Loading users...</p>
        ) : (
          <SortableTable
            columns={columns}
            data={users}
            onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default UsersList;