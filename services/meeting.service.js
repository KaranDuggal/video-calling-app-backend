const {meetingModel} = require('../models/meeting.model')
const {userModel} = require('../models/user.model')

function getAllMeetingUsers(meetingId){
    return Promise(async (resolve,reject)=>{
        try {
            resolve(await userModel.find({meetingId}))
        } catch (err) {
            reject(err)
        }
    })
}
function startMeeting(params){
    return Promise(async (resolve,reject)=>{
        try {
            const meeting = await meetingModel.create(params)
            resolve(meeting)
        } catch (err) {
            reject(err)
        }
    })
}
function joinMeeting(params){
    return Promise(async (resolve,reject)=>{
        try {
            const user = await userModel.create(params)
            await meetingModel.findOneAndUpdate({id:params.meetingId},{
                $addToSet:{
                    meetingUsers:user
                }
            })
            resolve(user)
        } catch (err) {
            reject(err)
        }
    })
}

function isMeetingPresent(meetingId){
    return Promise(async (resolve,reject)=>{
        try {
            const meeting = await meetingModel.findById(meetingId).populate('meetingUser', 'User')
            if(!meeting){
                throw 'Invalid Meeting Id'
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}
function checkMeetingExist(meetingId){
    return Promise(async (resolve,reject)=>{
        try {
            const meeting = await meetingModel.findById(meetingId,'hostId,hostName','startTime').populate('meetingUser', 'User')
            if(!meeting){
                throw 'Invalid Meeting Id'
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}
function getMeetingUsers(params){
    return Promise(async (resolve,reject)=>{
        try {
            const {meetingId,userId} = params
            const users = await userModel.find(meetingId,userId)
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}

function updateMeetingUser(params){
    return Promise(async (resolve,reject)=>{
        try {
            const {meetingId,userId} = params
            const users = await userModel.updateOne({userId},{$set:params},{new:true})
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}

function setUserBySocketId(params){
    return Promise(async (resolve,reject)=>{
        try {
            const {meetingId,socketId} = params
            const users = await userModel.find({meetingId,socketId}).limit(1)
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    getAllMeetingUsers,
    startMeeting,
    joinMeeting,
    isMeetingPresent,
    checkMeetingExist,
    getMeetingUsers,
    updateMeetingUser,
    setUserBySocketId,
}