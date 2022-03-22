const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
const path = require('path')
const { body, validationResult } = require('express-validator');

const movieService = require('./service');

app.use(express.json());

app.get('/movies', (req, res) => {
    if(req.query.duration || req.query.genres){
    res.send({"errors":[], "movies":movieService.findMovies(req.query)});
    } else {
        res.send( {"errors":[], "movies":[movieService.findRandomMovie()]});}
})

app.post('/movies',
body('genres').custom((value) => {return movieService.checkGenres(value)}).withMessage('genres doesnt match database'),
body('title').isLength({ min: 1 , max: 255}).withMessage('cannot be empty or be longer than 255 characters'),
body('year').matches(/\d/).withMessage('must contain a number'),
body('runtime').matches(/\d/).withMessage('must contain a number'),
body('director').isLength({ min: 1 , max: 255}).withMessage('cannot be empty or be longer than 255 characters'),
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
    let addMovieResponse = movieService.addMovie(req.body);
    res.status(200).json(addMovieResponse);}
  },
);

module.exports = app.listen(PORT, () => {
  console.log(`JSON DB Recruitment task is listening on port: ${PORT}`)
  console.log(`Author: Michał Białobrzeski`)
})