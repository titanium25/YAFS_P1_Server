const mongoose = require('mongoose')

let MembersSchema = new mongoose.Schema({
    name: String,
    email: String,
    city: String,
    color: String
}, {collection : 'members'})


module.exports = mongoose.model('Member', MembersSchema)