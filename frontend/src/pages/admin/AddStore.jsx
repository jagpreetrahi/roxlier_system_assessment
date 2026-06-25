import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import API from '../../api/axios';


const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  hint,
  value,
  error,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {hint && (
        <span className="text-gray-400 font-normal ml-1">
          ({hint})
        </span>
      )}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border rounded-lg px-4 py-2.5 text-sm
        outline-none focus:ring-2 transition
        ${
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
        }`}
    />

    {error && (
      <p className="text-red-500 text-xs mt-1">
        {error}
      </p>
    )}
  </div>
);

const AddStore = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({name: '', email: '', address: '', ownerId: ''});
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Store name is required';
    } else if (formData.name.length < 20) {
      newErrors.name = 'Store name must be at least 20 characters';
    } else if (formData.name.length > 60) {
      newErrors.name = 'Store name must not exceed 60 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Store email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.address) {
      newErrors.address = 'Store address is required';
    } else if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    if (!formData.ownerId) {
      newErrors.ownerId = 'Owner ID is required';
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
    if (!validate()) return;

    setLoading(true);
    try {
      await API.post('/stores', formData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/stores'), 1500);
    } catch (err) {
      const explanation = err.response?.data?.error?.explanation;
      setApiError(
        Array.isArray(explanation)
          ? explanation.join(', ')
          : 'Failed to create store'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate('/admin/stores')}
          className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
        >
          ← Back to Stores
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Add New Store</h1>

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 
              text-green-600 text-sm rounded-lg px-4 py-3">
              Store created successfully! Redirecting...
            </div>
          )}

          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 
              text-red-600 text-sm rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Store Name"
              name="name"
              placeholder="Enter store name"
              hint="20-60 characters"
              value={formData.name}        
              error={errors.name}          
              onChange={handleChange} 
            />
            <InputField
              label="Store Email"
              name="email"
              type="email"
              placeholder="store@example.com"
              value={formData.email}        
              error={errors.email}          
              onChange={handleChange} 
            />

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter store address"
                rows={3}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm 
                  outline-none focus:ring-2 transition resize-none
                  ${errors.address
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                  }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <InputField
              label="Owner ID"
              name="ownerId"
              placeholder="Paste Store Owner's user ID"
              hint="Must be a STORE_OWNER role user"
               value={formData.ownerId}        
              error={errors.ownerId}          
              onChange={handleChange} 

            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
              {loading ? 'Creating Store...' : 'Create Store'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStore;