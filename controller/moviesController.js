const express = require('express');
const router = express.Router();
const movieBL = require('../model/movie/movieBL');

const parseBool = (value, defaultValue) => ['true', 'false', true, false].includes(value) && JSON.parse(value) || defaultValue


// Get All Movies
router.route('/')
    .get(async function (req, res) {
        let page = parseInt(req.query.page) || 1;
        let size = parseInt(req.query.size) || 8;
        let all = parseBool(req.query.all) || false
        const movies = await movieBL.getAllMovies(page, size, all)
        res.json(movies);
    })

// Movies drop down
router.route('/dropDown/:memberId')
    .get(async function (req, res) {
        let memberId = req.params.memberId;
        // Check if ObjectId is valid
        if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
            let movie = await movieBL.dropDown(memberId)
            res.json(movie);
        } else {
            res.status(404).send('Not Found')
        }
    })

// Count number of movies
router.route('/lib/count')
    .get(async function (req, res) {
        let count = await movieBL.countMovies()
        res.json(count);
    })

// Get Movie by Id
router.route('/get/:id')
    .get(async function (req, res) {
        let id = req.params.id;
        // Check if ObjectId is valid
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            let movie = await movieBL.getMovie(id);
            res.json(movie);
        } else {
            res.status(404).send('Not Found')
        }
    })

// Add Movie
router.route('/')
    .post(async function (req, res) {
        let obj = req.body
        let status = await movieBL.addMovie(obj)
        res.json(status)
    })

// Add Review
router.route('/review/:movieId')
    .put(async function (req, res) {
        let obj = req.body
        let id = req.params.movieId
        let status = await movieBL.addReview(id, obj)
        res.json(status)
    })


// Update Movie
router.route('/:id')
    .put(async function (req, res) {
        let id = req.params.id;
        // Check if ObjectId is valid
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            let obj = req.body;
            let status = await movieBL.updateMovie(id, obj);
            res.json(status);
        } else {
            res.status(404).send('Not Found')
        }
    })

// Delete Movie
router.route('/:id')
    .delete(async function (req, res) {
        let id = req.params.id
        // Check if ObjectId is valid
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            let status = await movieBL.deleteMovie(id);
            res.json(status)
        } else {
            res.status(404).send('Not Found')
        }
    })

module.exports = router;