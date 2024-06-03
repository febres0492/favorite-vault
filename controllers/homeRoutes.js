const router = require('express').Router();

router.get('/', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  res.render('homepage');
});

router.get('/signin', async (req, res) => {
  // Send the rendered singin template
  res.render('signin')
})
module.exports = router;
