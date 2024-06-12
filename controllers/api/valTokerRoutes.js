const router = require('express').Router();
const {tokgen,sendToken} =require('../../utils/mailer')
const {Token, User} = require('../../models');

router.post('/change', async (req, res) => {
    console.log("Route: change")
    try {
        const val = await tokgen();
        const email = req.body.email;
        const user = await User.findOne({where:{email: email}})
        
        if(!user){
            res.status(400).json({message:"User not found"})
            return
        }
        //Delete all tokens
        await Token.destroy({ where: { user_email: req.body.email } })
        //add Token to Token DB
        await Token.create({user_email: user.email, token: val})
        //Send Token value to the email
        await sendToken(email,val);
        res.status(200).json({message:`Validation code sent ${email}`})
        console.log(`Validation code sent ${email}`)
        //Redirecting to the password reset form
        

    } catch (err) {
        res.status(400).json(err)
    }

})

module.exports = router;