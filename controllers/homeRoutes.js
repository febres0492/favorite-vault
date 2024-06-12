const router = require('express').Router();
const { User, Token } = require('../models');
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
    console.log('Here : updatepassword')
    console.log(req.body)
    const myToken = req.body.token
    console.log("This is the token" + myToken)
        
    //Import token from database
    const tokenItem= await Token.findOne({ where: { user_email: req.body.email } });
    if(myToken !== tokenItem.token){
        res.status(400).json({message : 'Token doesnt match'})
        return
    }
    console.log('The token matched the database')
        
    //Update the password of the user with the new password in the DB
    const currentUser = await User.update({password: req.body.newPassword},{where: {email: req.body.email}, individualHooks: true})
    console.log(currentUser)

  
    console.log("This is the new password: " + req.body.newPassword)
    //Render the login
    // res.redirect()

  
})


router.get('/:page', withAuth, async (req, res) => {
    const page = req.params.page;
    console.log(c('route subpage: '), page )
    renderPage({req, res, page})
})


module.exports = router;
