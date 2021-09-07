const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let CommentsSchema = new mongoose.Schema({
    movieId: {
        type: Schema.Types.ObjectId,
        ref: "movie",
        required: true,
    },
    comments: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        userName: String,
        image: String,
        date: Date,
        body: String
    }]
}, {collection: 'comments'})
module.exports = mongoose.model('Comments', CommentsSchema)