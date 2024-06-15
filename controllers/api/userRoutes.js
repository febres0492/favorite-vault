const router = require('express').Router();
const { User, Favorites } = require('../../models');
const c = require('../../utils/helpers').c
const bcrypt = require('bcrypt')
const sequelize = require('../../config/connection')

// logging in the user
router.post('/login', async (req, res) => {
    console.log(c('logging in the user','r'), req.body)
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);
        console.log(c('validPassword'), validPassword)
        if (!validPassword) {
            return res.status(400).json({ message: 'Incorrect email or password, please try again' });
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            console.log(c('You are now logged in'))
            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        console.log(c('err','r'), err)
        res.status(400).json(err);
    }
})

// logging out the user
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
})

// creating a new user
router.post('/signup', async (req, res) => {
    console.log('req.body', req.body)
    try {

        const userAlreadyExist = await User.findOne({ where: { email: req.body.email } })
        if (userAlreadyExist) {
            res.status(409).json({ message: 'Email already in use' })
            return
        }

        // renaming name_lastname to name
        const data = { ...req.body, name: req.body.name_lastname }
        delete data.name_lastname
        const userData = await User.create(data)

        req.session.save(() => {
            req.session.user_id = userData.id
            req.session.logged_in = true

            res.status(200).json(userData)
        })
    } catch (err) {
        console.log('err', err)
        res.status(400).json(err)
    }
})

// getting user's favorites
router.get('/getFavorites', async (req, res) => {
    try {
        const userId = req.session.user_id
        const type = req.query.type || 'all'

        if (!userId) {
            return res.status(401).json({ message: 'User not logged in' })
        }

        console.log(c('type','r'), type)
        let favorites
        if (type === 'all') {
            favorites = await Favorites.findAll({ where: { userId: userId } })
        } else {
            favorites = await Favorites.findAll({ where: { userId: userId, itemType: type } })
        }

        console.log(favorites)
        res.status(200).json(favorites)
    } catch (err) {
        console.log('err', err)
        res.status(500).json({ message: 'An error while getting favorites', error: err })
    }
})

//addding item to user's favorites
router.post('/addFavorite', async (req, res) => {
    try {
        const item = {
            userId: req.session.user_id,
            ...req.body
        }
        item.itemData = JSON.stringify(item.itemData)

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

// updating user's password when logged in
router.put('/update_password', async (req, res) => {
    const currentUser = await User.findOne({ where: { email: req.body.email } });
    if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    const checkingCurPass = await bcrypt.compare(req.body.currentPassword, currentUser.password);
    if(!checkingCurPass){
        return res.status(400).json({ message: 'Wrong current password' });
    }

    const isNewPassSameAsCurPass = await bcrypt.compare(req.body.newPassword, currentUser.password);
    if(isNewPassSameAsCurPass){
        return res.status(400).json({ message: 'Current password and New password cannot be the same' });
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    currentUser.password = hashedPassword;
    await currentUser.save();

    // loggin in the user
    req.session.user_id = currentUser.id;
    req.session.logged_in = true;

    return res.status(200).json({ message: 'Password Updated' });
})

// getting user's previous searches
router.get('/get_prev_searches', (req, res) => {
    const previousSearches = req.session.previousSearches || []
    console.log(c('previousSearches'), previousSearches)
    res.status(200).json({ searches: previousSearches })
})

// resetting favorites database
router.post('/reset_db', async (req, res) => {
    const { password } = req.body

    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ message: 'Invalid password' })
    }

    try {
        console.log(c('reset model', 'g'), 'Favorites')
        await Favorites.drop()
        await Favorites.sync()

        res.status(200).json({ message: 'Favorites table recreated successfully' })
    } catch (err) {
        console.log('err', err)
        res.status(400).json(err)
    }
})

module.exports = router;
