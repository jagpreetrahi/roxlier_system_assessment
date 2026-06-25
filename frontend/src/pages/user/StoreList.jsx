import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import { IoMdStar } from "react-icons/io";
import API from '../../api/axios';

const UserStoresList = () => {
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

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={star <= Math.round(rating)
          ? 'text-yellow-400'
          : 'text-gray-300'
        }
      >
        <IoMdStar/>
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Browse Stores</h1>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-3"
        >
          <input
            value={filters.name}
            onChange={(e) => setFilters(p => ({ ...p, name: e.target.value }))}
            placeholder="Search by name"
            className="border border-gray-300 rounded-lg px-3 py-2 
              text-sm outline-none focus:ring-2 focus:ring-blue-200 flex-1"
          />
          <input
            value={filters.address}
            onChange={(e) => setFilters(p => ({ ...p, address: e.target.value }))}
            placeholder="Search by address"
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
        ) : stores.length === 0 ? (
          <p className="text-gray-400 text-sm">No stores found</p>
        ) : (
          <div className="space-y-4">
            {stores.map(store => (
              <div
                key={store.id}
                className="bg-white rounded-2xl border shadow-sm p-5 
                  flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h2 className="font-semibold text-gray-800">{store.name}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{store.address}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-lg">
                      {renderStars(store.averageRating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {store.averageRating > 0
                        ? `${store.averageRating} / 5`
                        : 'No ratings yet'
                      }
                    </span>
                  </div>

                  {/* Show user's own rating if they rated */}
                  {store.userRating && (
                    <p className="text-xs text-blue-600 mt-1">
                      Your rating: <IoMdStar/> {store.userRating.rating}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/stores/${store.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white 
                    text-sm font-medium px-4 py-2 rounded-lg shrink-0 ml-4"
                >
                  View & Rate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStoresList;