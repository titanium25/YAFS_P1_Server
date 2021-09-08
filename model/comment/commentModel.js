const mongoose = require('mongoose')

let CommentsSchema = new mongoose.Schema({
    author: String,
    image: String,
    body: String,
    score: Number

}, {collection: 'comments'})
module.exports = mongoose.model('Comments', CommentsSchema)