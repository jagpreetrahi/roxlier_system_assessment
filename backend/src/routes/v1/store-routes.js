const router = require('express').Router();
const {StoreController} = require('../../controllers');
const { AuthMiddleware, RoleMiddleware, validateCreateStoreRequest, ValidationMiddleware } = require('../../middlewares');

router.post('/', AuthMiddleware.authenticate, RoleMiddleware.authorize('ADMIN'), ValidationMiddleware.validateCreateStoreRequest, StoreController.createStore);

router.get('/', AuthMiddleware.authenticate, RoleMiddleware.authorize('ADMIN', 'USER'), StoreController.getAllStores);

router.get('/:id', AuthMiddleware.authenticate, RoleMiddleware.authorize('USER'), StoreController.getStoreById );

module.exports = router;