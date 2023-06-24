const mongoose = require('mongoose');

userSchema = mongoose.Schema({
    socketId:{
        type:String,
    },
    meetingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Meeting'
    },
    userId:{
        type:String,
        require:true
    },
    joined:{
        type:Boolean,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    isAlive:{
        type:Boolean,
        require:true
    },
},{
    timestamps: true
})
const userModel = mongoose.model('User', userSchema)

module.exports = {
    userModel
}