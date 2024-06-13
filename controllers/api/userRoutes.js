const router = require('express').Router();
const { User, Favorites } = require('../../models');
const c = require('../../utils/helpers').c
const bcrypt = require('bcrypt')

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        console.log(c('userData'), userData)

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

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
});


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


module.exports = router;
