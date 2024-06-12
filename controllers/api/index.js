const router = require('express').Router();
const userRoutes = require('./userRoutes');
const externalApiRoutes = require('./externalApiRoutes');
const favoritesRoutes = require('./favoriteRoutes');
const token = require('./valTokerRoutes');

router.use('/favorite', favoritesRoutes);
router.use('/users', userRoutes);
router.use('/external', externalApiRoutes);
router.use('/token',token);

module.exports = router;
