const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let SubsSchema = new mongoose.Schema({
    memberId: {
        type: Schema.Types.ObjectId,
        ref: "member",
        required: true,
    },
    movies: [{
        movieId: {
            type: Schema.Types.ObjectId,
            ref: "movie",
            required: true,
        },
        name: String,
        image: String,
        date: Date
    }]
}, {collection: 'subscriptions'})
module.exports = mongoose.model('Subs', SubsSchema)