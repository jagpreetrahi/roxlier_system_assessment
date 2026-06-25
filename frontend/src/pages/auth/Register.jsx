import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 10) {
      newErrors.name = 'Name must be at least 20 characters';
    } else if (formData.name.length > 60) {
      newErrors.name = 'Name must not exceed 60 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (formData.password.length > 16) {
      newErrors.password = 'Password must not exceed 16 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);

    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      const explanation = err.response?.data?.error?.explanation;

      setApiError(
        Array.isArray(explanation)
          ? explanation.join(', ')
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Sign up to get started
          </p>
        </div>

        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            error={errors.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            hint="20-60 characters"
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            error={errors.password}
            onChange={handleChange}
            placeholder="••••••••"
            hint="8-16 chars, 1 uppercase, 1 special"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
              <span className="text-gray-400 font-normal ml-1">
                (max 400 characters)
              </span>
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows={3}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm
                outline-none focus:ring-2 transition resize-none
                ${
                  errors.address
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                }`}
            />

            <div className="flex justify-between">
              {errors.address ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address}
                </p>
              ) : (
                <span />
              )}

              <p
                className={`text-xs mt-1 ${
                  formData.address.length > 400
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                {formData.address.length}/400
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition text-sm"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;