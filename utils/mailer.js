const mailer = require('nodemailer');


const transport = mailer.createTransport({
    service: "gmail",

    auth:{
        user:'favoritevault904@gmail.com',
        pass:'FavoriteV4u1t!!'
    }
});