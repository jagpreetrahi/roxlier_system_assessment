import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import API from '../../api/axios';
import { IoMdSad } from 'react-icons/io';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/store-owner');
        setData(res.data.data);
      } catch (err) {
        setError('Failed to load store dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const columns = [
    { key: 'name',   label: 'Customer Name',
      render: (row) => row.user?.name },
    { key: 'email',  label: 'Email',
      render: (row) => row.user?.email },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <span className="text-yellow-500 font-semibold">
          <IoMdSad color='yellow-500'/> {row.rating}
        </span>
      )
    },
  ];

  const renderStars = (avg) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`text-3xl ${star <= Math.round(avg)
          ? 'text-yellow-400'
          : 'text-gray-200'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-bold text-gray-800 mb-8">My Store Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 
            rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        ) : (
          <div className="space-y-8">

            {/* Store Rating Card */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">
                {data.storeName}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex">{renderStars(data.averageRating)}</div>
                <span className="text-3xl font-bold text-gray-800">
                  {data.averageRating > 0 ? data.averageRating : '—'}
                </span>
                <span className="text-sm text-gray-400">/ 5</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Based on {data.totalRatings} review{data.totalRatings !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Raters Table */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Customers Who Rated Your Store
              </h2>

              {data.raters.length === 0 ? (
                <div className="bg-white rounded-2xl border p-6 
                  text-center text-gray-400 text-sm">
                  No ratings yet
                </div>
              ) : (
                <SortableTable
                  columns={columns}
                  data={data.raters}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;