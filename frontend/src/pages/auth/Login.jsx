import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      const { token, role } = res.data.data;

      login(token, role);
      if (role === 'ADMIN')       navigate('/admin/dashboard');
      if (role === 'USER')        navigate('/stores');
      if (role === 'STORE_OWNER') navigate('/my-store/dashboard');

    } catch (err) {
      setApiError(
         err.response?.data?.error?.explanation?.[0] || 'Invalid email or password'
       );
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-1 text-sm">Login to your account</p>
        </div>

       
        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 
            text-sm rounded-lg px-4 py-3">
            {apiError}
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm 
                outline-none focus:ring-2 transition
                ${errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm 
                outline-none focus:ring-2 transition
                ${errors.password
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
              text-white font-semibold py-2.5 rounded-lg transition text-sm"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;