const Movie = require('./movieModel')
const Subs = require('../subs/subsModel')
const subsBL = require('../subs/subsBL')

exports.countMovies = function () {
    return Movie.countDocuments({});
}

exports.addMovie = function (obj) {
    console.log(obj)
    return new Promise((resolve, reject) => {
        let movie = new Movie({
            name: obj.name,
            genres: obj.genres,
            image: {
                medium: obj.image.medium || 'na',
                original: obj.image.original || 'na'
            },
            premiered: obj.premiered,
            url: obj.url,
            language: obj.language,
            officialSite: obj.officialSite,
            rating: obj.rating,
            summary: obj.summary
        });


        movie.save(function (err) {
            if (err) {
                reject(console.log(err));
            } else {
                resolve('Created with id: ' + movie._id)
            }
        })
    });
}

exports.getAllMovies = async function (page, size, all) {
    return all ? Movie.find({}) :
        Movie.find().skip((size * page) - size).limit(size)
}

// Return movie list for dropdown menu with movies that member has not watched yet
exports.dropDown = async function (memberId) {
    // load member subscription
    const subs = await subsBL.getSubs(memberId)

    // not all members got subscription yet
    if (subs) {
        // pull movie name only
        const moviesWatchedArr = subs.movies.map(obj => obj.name)
        // return dropdown without movies that member watched
        return Movie.find({name: {$nin: moviesWatchedArr}});
    } else {
        // member has not got subscription yet, return all the movies
        return Movie.find({})
    }
}

exports.getMovie = function (id) {
    return Movie.findById(id)
}

exports.updateMovie = function (id, obj) {
    return new Promise((resolve, reject) => {
        Movie.findByIdAndUpdate(id, {
            movieId: obj.id,
            name: obj.name,
            genres: obj.genres,
            image: obj.image,
            rating: obj.rating,
            premiered: obj.premiered
        }, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve('Updated!')
            }
        })
    });
}

// Delete movie from movies and delete movie from subs
exports.deleteMovie = async function (id) {
    await subsBL.updateAllSubs(id)
    return Movie.findByIdAndDelete(id);
}