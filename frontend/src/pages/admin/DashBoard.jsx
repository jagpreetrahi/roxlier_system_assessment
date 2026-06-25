import { useState, useEffect } from 'react';
import Navbar from '../../components/NavBar';
import API from '../../api/axios';

const AdminDashBoard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/admin');
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ label, value, color }) => (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-2`}>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-4xl font-bold ${color}`}>
        {loading ? '...' : value ?? 0}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 
            rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers}
            color="text-blue-600"
          />
          <StatCard
            label="Total Stores"
            value={stats?.totalStores}
            color="text-green-600"
          />
          <StatCard
            label="Total Ratings"
            value={stats?.totalRatings}
            color="text-yellow-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;