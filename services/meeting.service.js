const {meetingModel} = require('../models/meeting.model')
const {userModel} = require('../models/user.model')

function getAllMeetingUsers(meetingId){
    return new Promise(async (resolve,reject)=>{
        try {
            resolve(await userModel.find({meetingId}))
        } catch (err) {
            reject(err)
        }
    })
}
function startMeeting(params){
    return new Promise(async (resolve,reject)=>{
        try {
            const meeting = await meetingModel.create(params);
            resolve(meeting)
        } catch (err) {
            reject(err)
        }
    })
}
function joinMeeting(params){
    return new Promise(async (resolve,reject)=>{
        try {
            const user = new userModel(params);
            const saveUser = await user.save()
            await meetingModel.findOneAndUpdate({_id:params.meetingId}, { $addToSet : {'meetingUsers':user}})
            resolve(saveUser)
        } catch (err) {
            reject(err)
        }
    })
}

function isMeetingPresent(meetingId){
    return new Promise(async (resolve,reject)=>{
        try {
            const meeting = await meetingModel.findById(meetingId).populate('meetingUsers')
            if(!meeting){
                throw 'Invalid Meeting Id'
            }
            resolve(meeting)
        } catch (err) {
            reject(err)
        }
    })
}
function checkMeetingExist(meetingId){
    return new Promise(async (resolve,reject)=>{
        try {
            console.log('------------------ check Run ----------------');
            if(!ObjectId.isValid(meetingId)){throw 'Invalid Meeting Id'}
            const meeting = await meetingModel.findById(meetingId,{'hostId':1,'hostName':1,'startTime':1}).populate('meetingUsers')
            if(!meeting){
                throw 'Invalid Meeting Id'
            }
            resolve(meeting)
        } catch (err) {
            reject(err)
        }
    })
}
function getMeetingUser(params){
    return new Promise(async (resolve,reject)=>{
        try {
            const {meetingId,userId} = params
            const users = await userModel.find({meetingId,userId})
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}

function updateMeetingUser(params){
    return new Promise(async (resolve,reject)=>{
        try {
            const {userId} = params
            const users = await userModel.updateOne({userId},{$set:params},{new:true})
            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}

function setUserBySocketId(params){
    return new Promise(async (resolve,reject)=>{
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
    getMeetingUser,
    updateMeetingUser,
    setUserBySocketId,
}