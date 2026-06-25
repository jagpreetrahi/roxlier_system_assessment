const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const {StoreService} = require('../services');

const createStore = async (req, res) => {
  try {
    const store = await StoreService.createStore({
      name:    req.body.name,
      email:   req.body.email,
      address: req.body.address,
      ownerId: req.body.ownerId
    });

    SuccessResponse.message = 'Store created successfully';
    SuccessResponse.data    = store;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to create store';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const getAllStores = async (req, res) => {
  try {
    const stores = await StoreService.getAllStores({
      name:    req.query.name,
      address: req.query.address,
      sortBy:  req.query.sortBy,
      order:   req.query.order
    });

    SuccessResponse.message = 'Stores fetched successfully';
    SuccessResponse.data    = stores;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to fetch stores';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await StoreService.getStoreById(
      req.params.id,
      req.user.id
    );

    SuccessResponse.message = 'Store fetched successfully';
    SuccessResponse.data    = store;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to fetch store';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

module.exports = { createStore, getAllStores, getStoreById };