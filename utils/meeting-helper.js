const meetingService = require('../services/meeting.service')
const {MeetingPayloadEnum} = require('./meeting-payload.enum')

function joinMeeting(meetingId,socket,meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId,name}= payload.data
            const isMeetingPresent = await meetingService.isMeetingPresent(meetingId)
            if(!isMeetingPresent) sendMessage(socket,{
                type:MeetingPayloadEnum.NOT_FOUND
            })
            else {
                const res = await addUser(socket,{meetingId,userId,name})
                if(res){
                    sendMessage(socket,{type:MeetingPayloadEnum.JOINED_MEETING,data:{userId}})
                    broadcastUsers(meetingId,socket,meetingServer,{
                        data:{
                            userId,
                            name,
                            ...payload.data
                        }
                    })
                }
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}
function forwardConnectionRequest(meetingId,socket, meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId, otherUserId,name} = payload.data
            const model = {
                meetingId,
                userId:otherUserId
            }
            const user = meetingService.getMeetingUsers(model)
            if(user){
                const sendPayload = JSON.stringify({
                    type: MeetingPayloadEnum.CONNECTION_REQUEST,
                    data:{
                        userId,
                        name,
                        ...payload.data
                    }
                })
                meetingServer.to(user.socketId).emit('message',sendPayload)
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function forwardIceCandidate(meetingId,socket, meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId, otherUserId,candidate} = payload.data
            const model = {
                meetingId,
                userId:otherUserId
            }
            const user = meetingService.getMeetingUsers(model)
            if(user){
                const sendPayload = JSON.stringify({
                    type: MeetingPayloadEnum.ICECANDIDATE,
                    data:{
                        userId,
                        candidate,
                        ...payload.data
                    }
                })
                meetingServer.to(user.socketId).emit('message',sendPayload)
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function forwardOfferSDP(meetingId,socket, meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId, otherUserId,sdp} = payload.data
            const model = {
                meetingId,
                userId:otherUserId
            }
            const user = meetingService.getMeetingUsers(model)
            if(user){
                const sendPayload = JSON.stringify({
                    type: MeetingPayloadEnum.OFFER_SDP,
                    data:{
                        userId,
                        sdp
                    }
                })
                meetingServer.to(user.socketId).emit('message',sendPayload)
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function forwardAnswerSDP(meetingId,socket, meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId, otherUserId,sdp} = payload.data
            const model = {
                meetingId,
                userId:otherUserId
            }
            const user = meetingService.getMeetingUsers(model)
            if(user){
                const sendPayload = JSON.stringify({
                    type: MeetingPayloadEnum.ANSWER_SDP,
                    data:{
                        userId,
                        sdp
                    }
                })
                meetingServer.to(user.socketId).emit('message',sendPayload)
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function userLeft(meetingId,socket, meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId} = payload.data
            broadcastUsers(meetingId,socket,meetingServer,{
                type:MeetingPayloadEnum.USER_LEFT,
                data:{
                    userId,
                }
            })
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function endMeeting(meetingId,socket, meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId} = payload.data
            broadcastUsers(meetingId,socket,meetingServer,{
                type:MeetingPayloadEnum.MEETING_ENDED,
                data:{
                    userId,
                }
            })
            const allUsers =await meetingService.getAllMeetingUsers(meetingId)
            for (let i = 0; i < allUsers.length; i++) {
                const meetingUser = allUsers[i];
                await meetingServer.socket.connected[meetingUser.socketId].disconnect()
                
            }
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function forwardEvent(meetingId,socket, meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            const {userId} = payload.data
            broadcastUsers(meetingId,socket,meetingServer,{
                type:MeetingPayloadEnum.MEETING_ENDED,
                data:{
                    userId,
                    ...payload.data
                }
            })
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}


function addUser(socket,{meetingId,userId,name}){
    return Promise(async (resolve,reject)=>{
        try {
            const result = meetingService.getAllMeetingUsers({meetingId,userId})
            if(!result){
                const model = {
                    socketId:socket.id,
                    meetingId:meetingId,
                    userId:userId,
                    joined:true,
                    name:name,
                    isAlive:true,
                }
                const res = await meetingService.joinMeeting(model)
            }else{
                await meetingService.updateMeetingUser({
                    userId,
                    socketId:socket.id
                })
            }
            resolve(true)
        } catch (err) {
            reject(err)
        }
    })
}
function sendMessage(socket,payload){
    return Promise(async (resolve,reject)=>{
        try {
            socket.send(JSON.stringify(payload))
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

function broadcastUsers(meeting,socket,meetingServer,payload){
    return Promise(async (resolve,reject)=>{
        try {
            socket.broadcast.emit('message',JSON.stringify(payload))
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    joinMeeting,
    forwardConnectionRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSDP,
    userLeft,
    endMeeting,
    forwardEvent,
}