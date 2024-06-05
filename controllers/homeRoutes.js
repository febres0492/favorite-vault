const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');
const { getpage, c } = require('../utils/helpers')

router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
        });

        const users = userData.map((project) => project.get({ plain: true }));

        res.render('homepage', {
            users,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


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
    getpage({req, res, page})
    // res.render('homepage' , {
    //     logged_in: req.session.logged_in,
    //     user_id: req.session.user_id,
    // })
})

module.exports = router;
