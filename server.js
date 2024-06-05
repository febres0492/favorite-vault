

const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
    secret: process.env.SESSIONSECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now seving on http://localhost:${PORT}/`));
});

const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
    {
      // TODO: Enter PostgreSQL username
      user: 'postgres',
      // TODO: Enter PostgreSQL password
      password: 'develop',
      host: 'localhost',
      database: 'postgres'
    },
    console.log(`Connected to the ${this.database} database.`)
  )
  
  pool.connect();
  
  // Add a fav movie
  app.post('/api/favorite-new-movie', ({ body }, res) => {
    const sql = `INSERT INTO favorites (movie_name)
      VALUES ($1)`;
    const params = [body.movie_name];
  
    pool.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });
  
  // Read all movies
  app.get('/api/favorite-movies', (req, res) => {
    const sql = `SELECT id, movie_name AS title FROM favorites`;
  
    pool.query(sql, (err, { rows }) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });
  
  // Delete a movie
  app.delete('/api/movie/:id', (req, res) => {
    const sql = `DELETE FROM movies WHERE id = $1`;
    const params = [req.params.id];
  
    pool.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: err.message });
      } else if (!result.rowCount) {
        res.json({
          message: 'Movie not found'
        });
      } else {
        res.json({
          message: 'deleted',
          changes: result.rowCount,
          id: req.params.id
        });
      }
    });
  });