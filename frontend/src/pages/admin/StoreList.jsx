import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import API from '../../api/axios';
import { IoMdStar } from "react-icons/io";

const AdminStoresList = () => {
  const navigate = useNavigate();
  const [stores,  setStores]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filters, setFilters] = useState({ name: '', address: '' });

  const fetchStores = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const res = await API.get('/stores', { params: appliedFilters });
      setStores(res.data.data);
    } catch (err) {
      setError('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    fetchStores(clean);
  };

  const handleReset = () => {
    setFilters({ name: '', address: '' });
    fetchStores();
  };

  const columns = [
    { key: 'name',    label: 'Store Name' },
    { key: 'email',   label: 'Email' },
    { key: 'address', label: 'Address' },
    {
      key: 'averageRating',
      label: 'Rating',
      render: (row) => (
        <span className="text-yellow-500 font-semibold">
          {row.averageRating > 0 ? `${<IoMdStar/>} ${row.averageRating}` : 'No ratings'}
        </span>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Stores</h1>
          <button
            onClick={() => navigate('/admin/stores/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white 
              text-sm font-medium px-4 py-2 rounded-lg"
          >
            + Add Store
          </button>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-3"
        >
          <input
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Filter by name"
            className="border border-gray-300 rounded-lg px-3 py-2 
              text-sm outline-none focus:ring-2 focus:ring-blue-200 flex-1"
          />
          <input
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            placeholder="Filter by address"
            className="border border-gray-300 rounded-lg px-3 py-2 
              text-sm outline-none focus:ring-2 focus:ring-blue-200 flex-1"
          />
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
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 
            rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Loading stores...</p>
        ) : (
          <SortableTable columns={columns} data={stores} />
        )}
      </div>
    </div>
  );
};

export default AdminStoresList;