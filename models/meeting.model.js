const mongoose = require('mongoose');

meetingSchema = mongoose.Schema({
    hostId:{
        type:String,
        require: true
    },
    hostName:{
        type:String,
        require: false
    },
    startTime:{
        type:Date,
        require: true
    },
    meetingUsers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
},{
    toJSON: {
        transform: function(doc,ret){
            delete ret.__v;
        } 
    }
},{
    timestamps: true
})
const meetingModel = mongoose.model( 'Meeting', meetingSchema)

module.exports = {
    meetingModel
}