const meetingService = require('../services/meeting.service')

exports.startMeeting = async (req,res,next)=>{
    try {
        const {hostId,hostName} = req.body
        const model = {
            hostId,
            hostName,
            startTime:Date.now
        }
        const data = await meetingService.startMeeting(model)
        res.status(200).json({message:'success',data})
    } catch (err) {
        next(err)
    }
}
exports.checkMeetingExist = async (req,res,next)=>{
    try {
        const {meetingId} = req.query
        const data = await meetingService.checkMeetingExist(meetingId)
        res.status(200).json({message:'success',data})
    } catch (err) {
        next(err)
    }
}
exports.getAllMeetingUser = async (req,res,next)=>{
    try {
        const {meetingId} = req.query
        const data = await meetingService.getAllMeetingUsers(meetingId)
        res.status(200).json({message:'success',data})
    } catch (err) {
        next(err)
    }
}