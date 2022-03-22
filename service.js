const movieRepository = require('./repository');

//TODO:  find best way to code this database search, maybe some library for database in JSON?
function findMovies(query){
    console.log(query);
    let jsonDB = movieRepository.readJsonFile();
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

function addMovie(body){
    let jsonDB = movieRepository.readJsonFile();
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
    movieRepository.saveJsonFile(jsonDB);
    return {"errors":[], "movies":[jsonDB.movies[jsonDB.movies.length-1]]}
}

function checkGenres(genres){
    let jsonDB = movieRepository.readJsonFile();
    return containsGenres(jsonDB.genres, genres)
}

function findRandomMovie(){
        let jsonDB = movieRepository.readJsonFile();
        return jsonDB.movies[Math.floor(Math.random() * jsonDB.movies.length) + 1];
        }

module.exports = { findRandomMovie, addMovie, findMovies, checkGenres };