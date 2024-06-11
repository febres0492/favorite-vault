const router = require('express').Router();
const { User, Favorites } = require('../../models');
const c = require('../../utils/helpers').c

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
            console.log(' --------- userAlreadyExist', userAlreadyExist)
            res.status(409).json({ message: 'Email already in use' })
            return
        }

        // renaming name_lastname to name
        const data = { ...req.body, name: req.body.name_lastname }
        delete data.name_lastname
        const userData = await User.create(data)

        // const FavoritesData = await Favorites.create({ userId: userData.id })
        // console.log(c('FavoritesData'), FavoritesData)

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

//addding item to user's favorites
router.post('/addFavorite', async (req, res) => {
    console.log(c('testing add User favorite route'))

    try {
        const item = {
            userId: req.session.user_Id,
            itemType: req.body.itemType,
            itemData: req.body.itemData,
        }
        const fabItem = await Favorites.create(item)
        res.status(200).json(fabItem)

    } catch (err) {
        console.log('err', err)
        res.status(400).json(err)
    }
})

module.exports = router;
