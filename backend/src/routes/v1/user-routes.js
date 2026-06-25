const router = require('express').Router();
const {UserController} = require('../../controllers');
const { AuthMiddleware, RoleMiddleware, ValidationMiddleware} = require('../../middlewares');


router.post('/', AuthMiddleware.authenticate, RoleMiddleware.authorize('ADMIN'), ValidationMiddleware.validateCreateUserRequest, UserController.createUser);

router.get('/', AuthMiddleware.authenticate, RoleMiddleware.authorize('ADMIN'), UserController.getAllUsers);

router.get('/:id', AuthMiddleware.authenticate, RoleMiddleware.authorize('ADMIN'), UserController.getUserById);

router.patch('/update-password', AuthMiddleware.authenticate, RoleMiddleware.authorize('ADMIN', 'USER', 'STORE_OWNER'), ValidationMiddleware.validateUpdatePasswordRequest, UserController.updatePassword);

module.exports = router;