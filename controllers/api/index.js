const router = require('express').Router();
const userRoutes = require('./userRoutes');
const externalApiRoutes = require('./externalApiRoutes');
const token = require('./valTokerRoutes');

router.use('/users', userRoutes);
router.use('/external', externalApiRoutes);
router.use('/token',token);

module.exports = router;
