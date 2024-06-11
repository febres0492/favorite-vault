const router = require('express').Router();
const userRoutes = require('./userRoutes');
const externalApiRoutes = require('./externalApiRoutes');
const favoritesRoutes = require('./favoriteRoutes');

router.use('/favorite', favoritesRoutes);
router.use('/users', userRoutes);
router.use('/external', externalApiRoutes);

module.exports = router;
