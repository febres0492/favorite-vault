require('dotenv').config();
const sequelize = require('./config/connection');
const express = require('express');
const { MovieWatchlist, Users, Movies } = require('./models');
const app =  express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
      const Data = await MovieWatchlist.findAll()
    //     include:[{
    //         model:Users, attributes:['user_name']
    //   },{model:Movies, attributes:['title', 'director']}]
    //   });
      res.status(200).json(Data);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  app.get('/movie', async (req, res) => {
    try {
      const Data = await Movies.findAll();
      res.status(200).json(Data);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  app.get('/user', async (req, res) => {
    try {
      const Data = await Users.findAll();
      res.status(200).json(Data);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  app.post('/movie', async (req, res) => {
    try {
      const Data = await Movies.create(req.body);
      res.status(200).json(Data);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  app.post('/user', async (req, res) => {
    try {
      const Data = await Users.create(req.body);
      res.status(200).json(Data);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  app.post('/list', async (req, res) => {
    try {
      const Data = await MovieWatchlist.create(req.body);
      res.status(200).json(Data);
    } catch (err) {
      res.status(500).json(err);
    }
  });


sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
  });