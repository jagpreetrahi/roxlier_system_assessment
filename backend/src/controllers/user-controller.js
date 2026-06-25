const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const {UserService} = require('../services');

const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser({
      name:     req.body.name,
      email:    req.body.email,
      password: req.body.password,
      address:  req.body.address,
      role:     req.body.role
    });

    SuccessResponse.message = 'User created successfully';
    SuccessResponse.data    = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to create user';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers({
      name:    req.query.name,
      email:   req.query.email,
      address: req.query.address,
      role:    req.query.role,
      sortBy:  req.query.sortBy,
      order:   req.query.order
      
    });

    SuccessResponse.message = 'Users fetched successfully';
    SuccessResponse.data    = users;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to fetch users';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);

    SuccessResponse.message = 'User fetched successfully';
    SuccessResponse.data    = user;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to fetch user';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await UserService.updatePassword(
      req.user.id,
      {
        currentPassword: req.body.currentPassword,
        newPassword:     req.body.newPassword
      }
    );

    SuccessResponse.message = 'Password updated successfully';
    SuccessResponse.data    = user;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = 'Failed to update password';
    ErrorResponse.error   = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
};

module.exports = { createUser, getAllUsers, getUserById, updatePassword };