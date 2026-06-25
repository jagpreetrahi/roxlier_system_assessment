import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import StarRating from '../../components/StarRating';
import API from '../../api/axios';
import { IoMdStar } from 'react-icons/io';

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [selectedStar,  setSelectedStar]  = useState(0);
  const [loading, setLoading]  = useState(true);
  const [submitting, setSubmitting]  = useState(false);
  const [error, setError]  = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchStore = async () => {
    try {
      const res = await API.get(`/stores/${id}`);
      const data = res.data.data;
      setStore(data);
      if (data.userRating) {
        setSelectedStar(data.userRating.rating);
      }
    } catch (err) {
      setError('Failed to load store details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStore(); }, [id]);

  const handleSubmitRating = async () => {
    if (selectedStar === 0) {
      setSubmitError('Please select a star rating');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      if (store.userRating) {
        // Already rated → update
        await API.patch('/ratings', {
          storeId: id,
          rating: selectedStar
        });
        setSubmitSuccess('Rating updated successfully!');
      } else {
        // Not rated yet → submit new
        await API.post('/ratings', {
          storeId: id,
          rating: selectedStar
        });
        setSubmitSuccess('Rating submitted successfully!');
      }
      // Refresh store to show updated rating
      await fetchStore();
    } catch (err) {
      const explanation = err.response?.data?.error?.explanation;
      setSubmitError(
        Array.isArray(explanation)
          ? explanation.join(', ')
          : 'Failed to submit rating'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate('/stores')}
          className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
        >
          ← Back to Stores
        </button>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading store...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 
            rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

            {/* Store Info */}
            <div>
              <h1 className="text-xl font-bold text-gray-800">{store.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{store.address}</p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-2xl font-bold text-yellow-500">
                  <IoMdStar/> {store.averageRating > 0 ? store.averageRating : '—'}
                </span>
                <span className="text-sm text-gray-500">Overall Rating</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Rating Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                {store.userRating ? 'Update Your Rating' : 'Submit Your Rating'}
              </h2>

              <StarRating
                value={selectedStar}
                onChange={setSelectedStar}
              />

              <p className="text-xs text-gray-400 mt-2">
                {selectedStar > 0
                  ? `You selected: ${selectedStar} star${selectedStar > 1 ? 's' : ''}`
                  : 'Click a star to rate'
                }
              </p>

              {submitError && (
                <div className="mt-3 bg-red-50 border border-red-200 
                  text-red-600 text-sm rounded-lg px-4 py-3">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="mt-3 bg-green-50 border border-green-200 
                  text-green-600 text-sm rounded-lg px-4 py-3">
                  {submitSuccess}
                </div>
              )}

              <button
                onClick={handleSubmitRating}
                disabled={submitting || selectedStar === 0}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 
                  disabled:bg-blue-300 text-white font-semibold 
                  py-2.5 rounded-lg transition text-sm"
              >
                {submitting
                  ? 'Submitting...'
                  : store.userRating
                    ? 'Update Rating'
                    : 'Submit Rating'
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;