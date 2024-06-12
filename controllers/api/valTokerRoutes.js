const router = require('express').Router();
const {tokgen,sendToken} =require('../../utils/mailer')
const {Token, User} = require('../../models');

router.post('/', async (req, res) => {
    res.status(200).json({message: 'Im working'})
})

router.post('/change', async (req, res) => {
    try {
        const val = await tokgen();
        const email = req.body.email;
        const user = await User.findOne({where:{email: email}})
        if(!user){
            res.status(400).json({message:"User not found"})
            return
        }
        sendToken(email,val);
        res.status(200).json({message:`Validation code sent ${email}`})
    } catch (err) {
        res.status(400).json(err)
    }

})

module.exports = router;