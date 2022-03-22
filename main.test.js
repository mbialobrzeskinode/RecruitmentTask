
const request = require('supertest'); // npm i -ED supertest
const app = require('./main'); // your expressjs app

describe('Get Endpoints', () => {
   it('should get random movie', async () => {
     const res = await request(app).get('/movies').send({})
     console.log(res)
     expect(res.statusCode).toEqual(200)
     expect(res.body).toHaveProperty('movies')
   })
})

describe('Post Endpoints', () => {
   it('should add movie', async () => {
     const res = await request(app).post('/movies').send({
        title : "Beetlejuice",
        year : "1989",
        runtime : "92",
        genres : [
            "Comedy",
                "Fantasy"
                    ],
        director : "Tim Burton",
        actors : "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
        plot : "A couple of recently deceased ghosts contract the services of a \"bio-exorcist\" in order to remove the obnoxious new owners of their house.",
        posterUrl : "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg"
        })
     console.log(res)
     expect(res.statusCode).toEqual(200)
     expect(res.body).toHaveProperty('movies')
   })
   it('should respond with errors', async () => {
        const res = await request(app).post('/movies').send({})
        console.log(res)
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('errors')
      })
})