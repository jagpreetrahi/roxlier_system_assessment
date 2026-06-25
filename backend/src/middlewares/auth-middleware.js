const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ErrorResponse.message = 'Authentication failed';
      ErrorResponse.error = new AppError(
        ['No token provided in the request'],
        StatusCodes.UNAUTHORIZED
      );
      return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

    const token = authHeader.split(' ')[1];
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    req.user = decoded;
    

    next();
  } catch (error) {
    ErrorResponse.message = 'Authentication failed';
    ErrorResponse.error = new AppError(
      ['Invalid or expired token'],
      StatusCodes.UNAUTHORIZED
    );
    return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
  }
};

module.exports = { authenticate };