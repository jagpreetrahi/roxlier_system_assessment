const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const {RatingRepository} = require('../repositories');

const ratingRepository = new RatingRepository();

const submitRating = async (userId, { storeId, rating }) => {
  
    if (rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', StatusCodes.BAD_REQUEST);
    }

    const existingRating = await ratingRepository.findByUserAndStore(userId, storeId);

    if (existingRating) {
        throw new AppError(
        'You already rated this store, please update your rating instead',
        StatusCodes.CONFLICT
        );
    }

    const newRating = await ratingRepository.create({ userId, storeId, rating });
    return newRating;

};

const updateRating = async (userId, { storeId, rating }) => {
    if (rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', StatusCodes.BAD_REQUEST);
    }

    const existingRating = await ratingRepository.findByUserAndStore(userId, storeId);

    if (!existingRating) {
        throw new AppError(
        'No rating found to update, please submit a rating first',
        StatusCodes.NOT_FOUND
        );
    }

    const updated = await ratingRepository.updateByUserAndStore(userId, storeId, rating);
    return updated;

};

module.exports = { submitRating, updateRating };