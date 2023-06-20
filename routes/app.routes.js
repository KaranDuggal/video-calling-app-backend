const meetingController = require('../controller/meeting.controller')

const express = require('express')
const router = express.Router()

router.post('/meeting/start',meetingController.startMeeting);
router.post('/meeting/join',meetingController.checkMeetingExist);
router.post('/meeting/get',meetingController.getAllMeetingUser);

module.exports = router