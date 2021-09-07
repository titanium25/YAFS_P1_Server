const mongoose = require('mongoose')

let MovieSchema = new mongoose.Schema({
    name: String,
    genres: [String],
    premiered: String,
    image: {
        medium: String,
        original: String
    },
    url: String,
    language: String,
    officialSite: String,
    rating: Number,
    summary: String,
    comments: { type : Array , "default" : [] }
}, {collection : 'movies'})

module.exports = mongoose.model('Movie', MovieSchema)