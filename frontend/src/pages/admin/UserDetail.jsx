import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import { IoMdStar } from "react-icons/io";
import API from '../../api/axios';

const UserDetail = () => {
  const { id }  = useParams();
  const navigate = useNavigate();
  const [user, setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setUser(res.data.data);
      } catch (err) {
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 
      border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 w-32 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800 mt-1 sm:mt-0">{value || '—'}</span>
    </div>
  );

  const roleBadge = (role) => {
    const styles = {
      ADMIN:       'bg-purple-100 text-purple-700',
      USER:        'bg-blue-100 text-blue-700',
      STORE_OWNER: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[role]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate('/admin/users')}
          className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
        >
           Back to Users
        </button>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading user...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 
            rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-6">User Details</h1>
            <InfoRow label="ID" value={user.id} />
            <InfoRow label="Name"    value={user.name} />
            <InfoRow label="Email"   value={user.email} />
            <InfoRow label="Address" value={user.address} />
            <div className="flex flex-col sm:flex-row sm:items-center py-3 
              border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500 w-32 shrink-0">
                Role
              </span>
              <span className="mt-1 sm:mt-0">{roleBadge(user.role)}</span>
            </div>

            
            {user.role === 'STORE_OWNER' && user.store && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 
                rounded-xl p-4">
                <p className="text-sm font-semibold text-yellow-700 mb-1">
                  Store: {user.store.name}
                </p>
                <p className="text-sm text-yellow-600">
                  Average Rating:{' '}
                  <span className="font-bold text-yellow-700">
                    <IoMdStar/> {user.store.averageRating ?? 'No ratings yet'}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;