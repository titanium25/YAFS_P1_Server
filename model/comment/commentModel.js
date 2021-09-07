const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let CommentsSchema = new mongoose.Schema({
    author: String,
    image: String,
    body: String

}, {collection: 'comments'})
module.exports = mongoose.model('Comments', CommentsSchema)