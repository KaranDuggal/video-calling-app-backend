// const {env} = require('../db/constant')
module.exports.configure = (mongoose) => {
    // let atlasDbUrl = `mongodb+srv://interviewAppByDuggal:${env.DB_PASSWORD}@cluster0.78pnm.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority`
    // let localDbUrl = `mongodb://localhost/${env.DB_NAME}`
    let url =  `mongodb://localhost/video-calling-app`
    let connect = function () {
        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true})
    }
    connect();
    let db = mongoose.connection;
    db.once('open', () => { console.log(`Connected to db \nenv 9000`); })
    db.on('disconnected', connect)
    db.on('error', console.log)
}; 