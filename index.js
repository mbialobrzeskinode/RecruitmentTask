const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000
const path = require('path')
const { body, validationResult } = require('express-validator');

app.use(express.json());

app.get('/movies', (req, res) => {
    if(req.query.duration || req.query.genres){
    res.send({"errors":[], "movies":findMovies(req.query)});
    } else {
        let jsonDB = readJsonFile();
        res.send( {"errors":[], "movies":[jsonDB.movies[Math.floor(Math.random() * jsonDB.movies.length) + 1]]});}
})

app.post('/movies',
body('title').isLength({ min: 1 , max: 255}).withMessage('cannot be empty or be longer than 255 characters'),
body('year').matches(/\d/).withMessage('must contain a number'),
body('runtime').matches(/\d/).withMessage('must contain a number'),
body('director').isLength({ min: 1 , max: 255}).withMessage('cannot be empty or be longer than 255 characters'),
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
    let addMovieResponse = addMovie(req.body);
    res.status(200).json(addMovieResponse);}
  },
);

function findMovies(query){
    console.log(query);
    let jsonDB = readJsonFile();
    var jsonResponse = [];
    if(query.duration && query.genres){
    for (var i = 0; i < jsonDB.movies.length; i++) {
        if((parseInt(jsonDB.movies[i].runtime,10) > parseInt(query.duration,10)-10 && parseInt(jsonDB.movies[i].runtime,10) < (parseInt(query.duration,10)+10)) && containsGenres(jsonDB.movies[i].genres, query.genres)){
            jsonResponse.push(jsonDB.movies[i]);
        }
    }
    } else if(query.duration){
        for (var i = 0; i < jsonDB.movies.length; i++) {
            if(parseInt(jsonDB.movies[i].runtime,10) > parseInt(query.duration,10)-10 && parseInt(jsonDB.movies[i].runtime,10) < (parseInt(query.duration,10)+10)){
                jsonResponse.push(jsonDB.movies[i]);
            }
        }
    } else if(query.genres){
        for (var i = 0; i < jsonDB.movies.length; i++) {
            if(containsGenres(jsonDB.movies[i].genres, query.genres)){
                jsonResponse.push(jsonDB.movies[i]);
            }
        }
    }
    return jsonResponse;
}

function containsGenres(jsonObjectGenres, genres){
    var containsGenres = false;
    for(var i = 0; i < jsonObjectGenres.length; i++){
        for(var j = 0; j < genres.length; j++){
            if(jsonObjectGenres[i] == genres[j]){
            containsGenres = true;
            }
        }
    }
    return containsGenres;
}

function readJsonFile(){
try {
    let rawdata = fs.readFileSync('./data/db.json');
    return JSON.parse(rawdata);
} catch (err) {
    console.log(err);
}
}

function addMovie(body){
    let jsonDB = readJsonFile();
    jsonDB.movies.push({
        "id": jsonDB.movies[jsonDB.movies.length-1].id+1,
        "title": body.title,
        "year": body.year,
        "runtime": body.runtime,
        "genres": body.genres,
        "director": body.director,
        "actors": body.actors,
        "plot": body.plot,
        "posterUrl": body.posterUrl
        });
    saveJsonFile(jsonDB);
    return {"errors":[], "movies":[jsonDB.movies[jsonDB.movies.length-1]]}
}

function saveJsonFile(json){
    fs.writeFileSync('./data/db.json', JSON.stringify(json));
}

app.listen(port, () => {
  console.log(`JSON DB Recruitment task is listening on port: ${port}`)
  console.log(`Author: Michał Białobrzeski`)
})