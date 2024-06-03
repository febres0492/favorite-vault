const router = require('express').Router();
const user = require('./api/userRoutes');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/user',user);

module.exports = router;
