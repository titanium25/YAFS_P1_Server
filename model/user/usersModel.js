const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")

const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    },
}, {collection: 'refreshTokens'})

const User = new Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    authStrategy: {
        type: String,
        default: "local",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    activated: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: [Session],
    },
    color: String
}, {collection: 'users'})

//Remove refreshToken from the response
User.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.refreshToken
        return ret
    },
})
User.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", User)