const router = require('express').Router();
const {RatingController} = require('../../controllers');
const { AuthMiddleware, RoleMiddleware, ValidationMiddleware} = require('../../middlewares');

router.post('/', AuthMiddleware.authenticate, RoleMiddleware.authorize('USER'), ValidationMiddleware.validateRatingRequest, RatingController.submitRating );

router.patch('/', AuthMiddleware.authenticate, RoleMiddleware.authorize('USER'), ValidationMiddleware.validateRatingRequest, RatingController.updateRating);

module.exports = router;