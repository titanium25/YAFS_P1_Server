const express = require("express");
const router = express.Router();
const User = require("../model/user/usersModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userBL = require("../model/user/userBL");
const jsonDAL = require('../DAL/jsonDAL');

function randomColor() {
    let hex = Math.floor(Math.random() * 0xFFFFFF);
    return "#" + hex.toString(16);
}


const {
    getToken,
    COOKIE_OPTIONS,
    getRefreshToken,
    verifyUser,
} = require("../authenticate")

router.post("/signup", (req, res, next) => {
    console.log(req.body)
    // Verify that first name is not empty
    if (!req.body.firstName) {
        res.statusCode = 500
        res.send({
            name: "FirstNameError",
            message: "The first name is required",
        })
    } else {
        User.register(
            new User({ username: req.body.username }),
            req.body.password || ' ',

             (err, user) => {
                if (err) {
                    console.log(err)
                    res.statusCode = 500
                    res.send(err)
                } else {
                    user.firstName = req.body.firstName
                    user.lastName = req.body.lastName || ""
                    user.color = randomColor()
                    const token = getToken({_id: user._id})
                    const refreshToken = getRefreshToken({_id: user._id})
                    user.refreshToken.push({refreshToken})
                    user.save(async (err, user) => {
                        if (err) {
                            res.statusCode = 500
                            res.send(err)
                        } else {
                            await userBL.addUser(user)
                            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                            res.send({success: true, token})
                        }
                    })

                }
            }
        )
    }
})

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    const token = getToken({ _id: req.user._id })
    const refreshToken = getRefreshToken({ _id: req.user._id })
    User.findById(req.user._id).then(
        user => {
            user.refreshToken.push({ refreshToken })
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500
                    res.send(err)
                } else {
                    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                    res.send({ success: true, token })
                }
            })
        },
        err => next(err)
    )
})

router.post("/refreshToken", (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = payload._id
            User.findOne({ _id: userId }).then(
                user => {
                    if (user) {
                        // Find the refresh token against the user record in database
                        const tokenIndex = user.refreshToken.findIndex(
                            item => item.refreshToken === refreshToken
                        )
                        if (tokenIndex === -1) {
                            res.statusCode = 401
                            res.send("Unauthorized")
                        } else {
                            const token = getToken({ _id: userId })
                            // If the refresh token exists, then create new one and replace it.
                            const newRefreshToken = getRefreshToken({ _id: userId })
                            user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode = 500
                                    res.send(err)
                                } else {
                                    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                                    res.send({ success: true, token })
                                }
                            })
                        }
                    } else {
                        res.statusCode = 401
                        res.send("Unauthorized")
                    }
                },
                err => next(err)
            )
        } catch (err) {
            res.statusCode = 401
            res.send("Unauthorized")
        }
    } else {
        res.statusCode = 401
        res.send("Unauthorized")
    }
})

router.get("/me", verifyUser, (req, res, next) => {
    res.send(req.user)
})

router.get("/logout", verifyUser, (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
    User.findById(req.user._id).then(
        user => {
            const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
            )
            if (tokenIndex !== -1) {
                user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
            }
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500
                    res.send(err)
                } else {
                    res.clearCookie("refreshToken", COOKIE_OPTIONS)
                    res.send({ success: true })
                }
            })
        },
        err => next(err)
    )
})

// Get All Users
router.route('/')
    .get(async function (req, res) {
        let users = await userBL.getAllUsers();
        res.json(users);
    })

// Delete User
router.route('/:userId')
    .delete(async function (req, res) {
        let userId = req.params.userId
        if (userId.match(/^[0-9a-fA-F]{24}$/)) {
            let status = await userBL.deleteUser(userId);
            res.json(status)
        } else {
            res.status(404).send('Not Found')
        }
    })

// Update User
router.route('/:userId')
    .put(async function (req, res) {
        let userId = req.params.userId;
        if (userId.match(/^[0-9a-fA-F]{24}$/)) {
            let obj = req.body;
            console.log(obj)
            let status = await userBL.updateUser(userId, obj);
            res.json(status);
        } else {
            res.status(404).send('Not Found')
        }
    })

module.exports = router