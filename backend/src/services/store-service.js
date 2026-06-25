const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {StoreRepository} = require('../repositories');
const {UserRepository} = require('../repositories');

const storeRepository = new StoreRepository();
const userRepository = new UserRepository();

const createStore = async (data) => {
  
  const owner = await userRepository.get(data.ownerId);

   if (owner.role !== 'STORE_OWNER') {
        throw new AppError(
        'Assigned user must have STORE_OWNER role',
        StatusCodes.BAD_REQUEST
        );
    }

  const store = await storeRepository.create(data);
  return store;
};

const getAllStores = async (filters) => {
 
  const stores = await storeRepository.getAllWithFilters(filters);

  return stores.map(store => {
        const avgRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;

        return {
            ...store,
            averageRating: parseFloat(avgRating.toFixed(1)),
            ratings: undefined
        };
    });
};

const getStoreById = async (storeId, userId) => {
    const store = await storeRepository.getStoreWithUserRating(storeId, userId);

    const avgRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;

    return {
        ...store,
        averageRating: parseFloat(avgRating.toFixed(1)),
        ratings: undefined,
        userRating: store.userRating[0] || null
    };
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById
};