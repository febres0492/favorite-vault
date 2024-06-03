const router = require('express').Router();
const { User } = require('../../models');
const {Op} = require('sequelize');



router.post('/', async (req, res) => {
  try {
    const Data = await User.findOne({
      where:{email: req.body.email},
    });

    // If there is no user with that email sends an error message
    if(!Data){
      res.status(400).json({message: 'No account with that email address'});
      return;
    }

    const rightPass = Data.checkPassword(req.body.password);

    // If the password does not match the email sends an error message
    if(!rightPass){
      res.status(400).json({message: 'Invalid password'});
      return;
    }

    // Save the session and set session variables
    req.session.save(() => {
      req.session.user_id = Data.id;
      req.session.logged_in = true;

      res.status(200).json(Data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/signin', async (req, res) => {
  try {
    // If an user with unique data matching the new user exists sends an error message
    const existingUser = await User.findOne({
      where:{
        [Op.or]:[{user_name:req.body.user_name}, {email:req.body.email}]
      },
    });
    if(existingUser){
      res.status(400).json({message:'Username or email already in use'});
      return;
    }
    const Data = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = Data.id;
      req.session.logged_in = true;

      res.status(200).json(Data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;