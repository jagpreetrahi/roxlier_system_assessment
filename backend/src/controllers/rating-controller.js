const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const {RatingService} = require('../services');

const submitRating = async (req, res) => {
  try {
    const rating = await RatingService.submitRating(
      req.user.id,
      {
        storeId: req.body.storeId,
        rating:  Number(req.body.rating)
      }
    );

    SuccessResponse.message = 'Rating submitted successfully';
    SuccessResponse.data    = rating;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to submit rating';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const updateRating = async (req, res) => {
  try {
    const rating = await RatingService.updateRating(
      req.user.id,
      {
        storeId: req.body.storeId,
        rating:  Number(req.body.rating)
      }
    );

    SuccessResponse.message = 'Rating updated successfully';
    SuccessResponse.data    = rating;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to update rating';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

module.exports = { submitRating, updateRating };