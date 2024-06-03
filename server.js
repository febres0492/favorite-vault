require('dotenv').config();
const session = require('express-session');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const app = express();
const PORT = process.env.PORT || 3010;


// Configure the express-session middleware for session management
const sess = {
  // Secret used for the session ID cookie for security
  secret: process.env.SESSIONSECRET,
  // Avoids saving the session on every request
  resave: false,
  // Creates a session only if it is modified during the request
  saveUninitialized: true,
  // Cookie configuration
  cookie: {
   // If true it can only sent the cookie  over https
   secure: false,
   // Makes sure client side javascript can't access it
   httpOnly:true,
   // Sets the expiration for the cookie to one hour
   maxAge:3600000,
   // Ensures the cookie can't be sent to 3rd party requests
   sameSite:'strict',
  },
  // Initialize session store using SequelizeStore for managing session data
  store: new SequelizeStore({
   db: sequelize
  })
}
// Use the express-session middleware for session management
app.use(session(sess));

// Create the Handlebars.js engine object with custom helper functions
const hbs = exphbs.create({ helpers });

// Inform Express.js which template engine we're using
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening on http://localhost:3010/'));
});
