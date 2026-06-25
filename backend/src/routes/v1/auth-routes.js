const router = require('express').Router();
const { AuthController } = require('../../controllers');
const { ValidationMiddleware } = require('../../middlewares');

router.post('/register', ValidationMiddleware.validateRegisterRequest, AuthController.register);
router.post('/login',    ValidationMiddleware.validateLoginRequest,    AuthController.login);

module.exports = router;