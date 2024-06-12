const router = require('express').Router();
const { User, Token } = require('../models');
const withAuth = require('../utils/auth');
const { renderPage, c } = require('../utils/helpers')
const bcrypt = require('bcrypt');

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

router.get('/forgotpwform', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }

    res.render('forgotpwform')
})

router.get('/passwordresetform', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
        return
    }
    res.render('passwordresetform')
})

router.put('/updatepassword', async (req, res) => {
    try {

        // Import token from database
        const tokenItem = await Token.findOne({ where: { user_email: req.body.email } });
        if (!tokenItem) {
            return res.status(400).json({ message: 'Token not found' });
        }

        if (req.body.token !== tokenItem.token) {
            return res.status(400).json({ message: 'Token doesn\'t match' });
        }
        
        const currentUser = await User.findOne({ where: { email: req.body.email } });
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        currentUser.password = hashedPassword;
        await currentUser.save();

        // loggin in the user
        req.session.user_id = currentUser.id;
        req.session.logged_in = true;

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'An error occurred while updating the password' });
    }
});

router.get('/:page', withAuth, async (req, res) => {
    const page = req.params.page;
    console.log(c('route subpage: '), page )
    renderPage({req, res, page})
})

module.exports = router;
