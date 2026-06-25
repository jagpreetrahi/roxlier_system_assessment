// src/pages/shared/UpdatePassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import API from '../../api/axios';

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '', newPassword: ''
  });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (formData.newPassword.length > 16) {
      newErrors.newPassword = 'Password must not exceed 16 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one special character';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      await API.patch('/users/update-password', formData);
      setSuccess('Password updated successfully!');
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      const explanation = err.response?.data?.error?.explanation;
      setApiError(
        Array.isArray(explanation)
          ? explanation.join(', ')
          : 'Failed to update password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Change Password</h1>

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 
              text-green-600 text-sm rounded-lg px-4 py-3">
              {success}
            </div>
          )}

          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 
              text-red-600 text-sm rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'currentPassword', label: 'Current Password' },
              { name: 'newPassword',     label: 'New Password',
                hint: '8-16 chars, 1 uppercase, 1 special' }
            ].map(({ name, label, hint }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                  {hint && (
                    <span className="text-gray-400 font-normal ml-1">({hint})</span>
                  )}
                </label>
                <input
                  type="password"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm 
                    outline-none focus:ring-2 transition
                    ${errors[name]
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;