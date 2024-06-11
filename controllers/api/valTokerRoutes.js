const router = require('express').Router();
const {Token} = require('../../models');

router.post('/', async (req, res) => {
    res.status(200).json({message: 'Im working'})
})

module.exports = router;