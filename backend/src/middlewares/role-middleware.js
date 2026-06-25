const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

const authorize = (...allowedRoles) => {
   return (req, res, next) => {
        if (!req.user) {
        ErrorResponse.message = 'Authorization failed';
        ErrorResponse.error = new AppError(
            ['User not authenticated'],
            StatusCodes.UNAUTHORIZED
        );
        return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
        }

        if (!allowedRoles.includes(req.user.role)) {
            ErrorResponse.message = 'Authorization failed';
            ErrorResponse.error = new AppError(
                ['You do not have permission to access this resource'],
                StatusCodes.FORBIDDEN
                
            );
             return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
        }

      next();
    };
};

module.exports = { authorize };