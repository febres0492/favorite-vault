const router = require('express').Router();
const c = require('../../utils/helpers').c
const {Favorites } = require('../../models');


// getting user's favorites
router.get('/getFavorites', async (req, res) => {
    try {
        const userId = req.session.user_id
        const favorites = await Favorites.findAll({ where: {userId: userId} })
        console.log(favorites);
        res.status(200).json(favorites)
    } catch (err) {
        console.log('err', err)
        res.status(400).json(err)
    }
})


//addding item to user's favorites
router.post('/addFavorite', async (req, res) => {
    console.log('Hello')
    try {
        const item = {
            userId: req.session.user_id,
            ...req.body
        }
        console.log(c('item'), item)

        const fabItem = await Favorites.create(item)
        res.status(200).json(fabItem)

    } catch (err) {
        console.log('err', err)
        res.status(400).json(err)
    }
})




// deleting user's favorite
router.delete('/deleteFavorite', async (req, res) => {
    console.log(c('testing deleteFavorite route'))
    try {
        const userId = req.session.user_id
        const itemId = req.body.itemId
        const deleted = await Favorites.destroy({ where: { userId: userId, id: itemId } })
        res.status(200).json(deleted)
    } catch (err) {
        console.log('err', err)
        res.status(400).json(err)
    }
})

module.exports = router;