const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const { AuthService } = require('../services');

const register = async (req, res) => {
  try {
    const user = await AuthService.register({
      name:     req.body.name,
      email:    req.body.email,
      password: req.body.password,
      address:  req.body.address
    });

    SuccessResponse.message = 'User registered successfully';
    SuccessResponse.data    = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to register user';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const login = async (req, res) => {
  try {
    const result = await AuthService.login({
      email:    req.body.email,
      password: req.body.password
    });

    SuccessResponse.message = 'Logged in successfully';
    SuccessResponse.data    = result;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to login';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

module.exports = { register, login };