require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const movieData = require('./movies-data-small.json');

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;

  let filteredMovies = [...movieData];

  if (genre) {
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase());
    });
  }

  if (country) {
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.country.toLowerCase().includes(country.toLowerCase());
    });
  }

  if (avg_vote) {
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.avg_vote >= parseFloat(avg_vote);
    });
  }

  res.json(filteredMovies);
});

app.listen(8000, () => {
  console.log('Server listening on PORT 8000');
});
