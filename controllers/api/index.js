const router = require('express').Router();
const userRoutes = require('./userRoutes');
const externalApiRoutes = require('./externalApiRoutes');

router.use('/users', userRoutes);
router.use('/external', externalApiRoutes);

module.exports = router;
