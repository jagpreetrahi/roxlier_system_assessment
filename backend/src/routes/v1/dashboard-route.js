const router = require('express').Router();
const {DashboardController} = require('../../controllers');
const { AuthMiddleware, RoleMiddleware } = require('../../middlewares');

router.get('/admin', AuthMiddleware.authenticate, RoleMiddleware.authorize('ADMIN'), DashboardController.getAdminStats);

router.get('/store-owner', AuthMiddleware.authenticate, RoleMiddleware.authorize('STORE_OWNER'), DashboardController.getStoreOwnerStats
);

module.exports = router;