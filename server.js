const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const cookieParser = require('cookie-parser');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3004;

const hbs = exphbs.create({
    helpers,
    partialsDir: [path.join(__dirname, 'views', 'partials')]
});

const sess = {
    secret: process.env.SESSIONSECRET,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess))
app.use(cookieParser())

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(routes)

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(helpers.c(`Now seving on http://localhost:${PORT}/`)))
})
