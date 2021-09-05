const express = require('express');
const router = express.Router();
const subsBL = require('../model/subs/subsBL');
const memberBL = require('../model/member/memberBL');


// Get All Subs
router.route('/')
    .get(async function (req, res) {
        const subs = await subsBL.getAllSubs();
        res.json(subs);
    })

// Get member list
router.route('/movie/:movieId')
    .get(async function (req, res) {
        const movieId = req.params.movieId;
        const subs = await subsBL.getAllSubs();
        const membersArr = []

        await Promise.all(subs.map(async (subs) =>
            await Promise.all(subs.movies.map(async (element) => {
                    if (element.movieId == movieId) {
                        let member = await memberBL.getMember(subs.memberId)
                        let obj = {
                            name: member.name,
                            date: element.date,
                            color: member.color
                        }
                        membersArr.push(obj)
                    }
                }
            ))))

        res.json(await Promise.all(membersArr));
    })

// Add Subs
router.route('/')
    .post(async function (req, res) {
        let obj = req.body
        let status = await subsBL.addSubs(obj)
        res.json(status)
    })


// Get Subs by memberId
router.route('/get/:memberId')
    .get(async function (req, res) {
        const memberId = req.params.memberId;
        // Check if ObjectId is valid
        if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
            let subs = await subsBL.getSubs(memberId);
            res.json(subs);
        } else {
            res.status(404).send('Not Found')
        }
    })

// Delete Subs by member id
router.route('/:memberId')
    .delete(async function (req, res) {
        let memberId = req.params.memberId
        // Check if ObjectId is valid
        if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
            let status = await subsBL.deleteSubs(memberId)
            res.json(status)
        } else {
            res.status(404).send('Not Found')
        }
    })

// Update All Subs - delete specific movie from all subs
router.route('/:movieId')
    .put(async function (req, res) {
        let id = req.params.movieId;
        // Check if ObjectId is valid
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            let status = await subsBL.updateAllSubs(id);
            res.json(status);
        } else {
            res.status(404).send('Not Found')
        }
    })

// Update Subs - delete specific movie from a specific subs
router.route('/movie/:movieId/subs/:subsId')
    .put(async function (req, res) {
        let movieId = req.params.movieId;
        let subsId = req.params.subsId;
        // Check if ObjectId is valid
        if (movieId.match(/^[0-9a-fA-F]{24}$/) && subsId.match(/^[0-9a-fA-F]{24}$/)) {
            let status = await subsBL.updateSubs(movieId, subsId)
            res.json(status);
        } else {
            res.status(404).send('Not Found')
        }
    })

module.exports = router;