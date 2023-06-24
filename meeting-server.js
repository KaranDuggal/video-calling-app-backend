const meetingHelper = require('./utils/meeting-helper')
const {MeetingPayloadEnum} = require('./utils/meeting-payload.enum')

function listenMessage(meetingId,socket,meetingServer) {
    socket.on('message',(message)=>{
        return handleMessage(meetingId,socket,message,meetingServer)
    })
}
function handleMessage(meetingId,socket,message,meetingServer) {
    let payload = typeof message === 'string' ? JSON.parse(message) : message;
    console.log('payload --> ', payload)
    switch (payload.type) {
        case MeetingPayloadEnum.JOIN_MEETING:
            meetingHelper.joinMeeting(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.CONNECTION_REQUEST:
            meetingHelper.forwardConnectionRequest(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.OFFER_SDP:
            meetingHelper.forwardOfferSDP(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.ICECANDIDATE:
            meetingHelper.forwardIceCandidate(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.ANSWER_SDP:
            meetingHelper.forwardAnswerSDP(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.LEAVE_MEETING:
            meetingHelper.userLeft(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.END_MEETING:
            meetingHelper.endMeeting(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.VIDEO_TOGGLE:
        case MeetingPayloadEnum.AUDIO_TOGGLE:
            meetingHelper.forwardEvent(meetingId,socket,meetingServer,payload)
            break;
        case MeetingPayloadEnum.UNKNOWN:
            break;
        default:
            break;
    }
}

function initMeetingServer(server) {
    const meetingServer = require('socket.io')(server)
    meetingServer.on('connection',socket=>{
        console.log(' ----------------------------- Socket connect ------------------------------ ');
        const meetingId = socket.handshake.query.id
        console.log('meetingId', meetingId)
        listenMessage(meetingId,socket,meetingServer)
    })
}

module.exports = {
    initMeetingServer
}