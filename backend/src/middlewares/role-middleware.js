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
            /*
            Why FORBIDDEN (403) not UNAUTHORIZED (401)?
            401 = not authenticated (don't know who you are)
            403 = authenticated but not permitted (know who you are,
            but you don't have access)
            */
        );
        return res.status(StatusCodes.FORBIDDEN).json(ErrorResponse);
        }

      next();
    };
};

module.exports = { authorize };