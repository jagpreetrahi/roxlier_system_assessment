const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { DashBoardService } = require('../services');

const getAdminStats = async (req, res) => {
  try {
    const stats = await DashBoardService.getAdminStats();
    SuccessResponse.message = 'Admin stats fetched successfully';
    SuccessResponse.data    = stats;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log('DASHBOARD ERROR:', error.message); // ← add this
    console.log('FULL ERROR:', error);  
    ErrorResponse.message = 'Failed to fetch admin stats';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const getStoreOwnerStats = async (req, res) => {
  try {
    const stats = await DashboardService.getStoreOwnerStats(req.user.id);
    SuccessResponse.message = 'Store stats fetched successfully';
    SuccessResponse.data    = stats;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to fetch store stats';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

module.exports = { getAdminStats, getStoreOwnerStats };