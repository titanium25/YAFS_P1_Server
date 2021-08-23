const express = require('express');
const router = express.Router();
const memberBL = require('../model/member/memberBL');

// Get All Members
router.route('/')
    .get(async function (req, res) {
        let find = req.query.find || '';
        let members = await memberBL.getAllMembers(find);
        res.json(members);
    })

// Get Member by Id
router.route('/get/:memberId')
    .get(async function (req, res) {
        let memberId = req.params.memberId;
        // Check if ObjectId is valid
        if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
            let member = await memberBL.getMember(memberId);
            res.json(member);
        } else {
            res.status(404).send('Not Found')
        }
    })

// Add Member
router.route('/')
    .post(async function (req, res) {
        let obj = req.body
        let status = await memberBL.addMember(obj)
        res.json(status)
    })

// Update Member
router.route('/:memberId')
    .put(async function (req, res) {
        let memberId = req.params.memberId;
        if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
            let obj = req.body;
            let status = await memberBL.updateMember(memberId, obj);
            res.json(status);
        } else {
            res.status(404).send('Not Found')
        }
    })

// Delete Member
router.route('/:memberId')
    .delete(async function (req, res) {
        let memberId = req.params.memberId
        if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
            let status = await memberBL.deleteMember(memberId);
            res.json(status)
        } else {
            res.status(404).send('Not Found')
        }
    })

module.exports = router;