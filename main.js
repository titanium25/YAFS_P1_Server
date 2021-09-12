const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require('passport')

const membersController = require('./controller/membersController');
const moviesController = require('./controller/moviesController');
const subsController = require('./controller/subsController');
const userController = require('./controller/userController');

if (process.env.NODE_ENV !== "production") {
    // Load environment variables from .env file in non prod environments
    require("dotenv").config()
}
const app = express();

app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

require("./config/database")
require("./config/dbInit")
require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./authenticate")

//Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(",")
    : []

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize())

app.use('/api/members', membersController);
app.use('/api/movies', moviesController);
app.use('/api/subs', subsController);
app.use("/api/users", userController)

//Start the server in port 2020
const server = app.listen(process.env.PORT || 2020, function () {
    const port = server.address().port
    console.log("App started at port:", port)
})