const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');
const { renderPage, c } = require('../utils/helpers')

router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
        });

        const users = userData.map((project) => project.get({ plain: true }));
        console.log(c('users: '), users.find(user => user.id === req.session.user_id))
        res.render('homepage', {
            users,
            currUser: users.find(user => user.id === req.session.user_id),
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/addFavorite', async (req, res) => {
    try {
        const item = {
            userId: req.session.user_id,
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

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }

    res.render('signup')
})

router.get('/:page', withAuth, async (req, res) => {
    const page = req.params.page;
    console.log(c('route subpage: '), page )
    renderPage({req, res, page})
})

module.exports = router;
