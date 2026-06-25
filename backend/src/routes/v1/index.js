const express = require('express');
const router = express.Router()

router.use('/auth',      require('./auth-routes'));
router.use('/users',     require('./user-routes'));
router.use('/stores',    require('./store-routes'));
router.use('/ratings',   require('./rating-routes'));
router.use('/dashboard', require('./dashboard-route'));

module.exports = router;