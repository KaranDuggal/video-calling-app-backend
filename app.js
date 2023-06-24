/*global mongoose __dirname publicDirPath*/
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const colors = require('colors')
// const { env } = require('./db/constant');
const fs = require('fs');
global.mongoose = require('mongoose');
global.ObjectId = mongoose.Types.ObjectId;
global.badRequestErr = (msg)=>{
    return {
        status:400,
        message:msg
    }
};
global.jsonLog = (data)=>{ console.log('JSON-LOG -->',colors.green(JSON.stringify(data,null,5))) };
global.publicDirPath = path.join(__dirname,'./public/')
require('./db/config').configure(mongoose);

const app = express();
// console.log(env)
// if(env.Logs === 'true'){
    // eslint-disable-next-line no-unused-vars
    logger.token('body', (req,res) => JSON.stringify(req.body, 0, 2));
    app.use(logger(colors.green(':method '+colors.yellow(':url')+' :status :response-time ms - :res[content-length] ' +colors.blue(':body')+' - :req[content-length]')));
// }


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// app.use('/api/admin', require('./routes/admin/index'));
// app.use('/api/common', require('./routes/common/index'));
app.use('/api',require('./routes/app.routes')); 


/**Error handler */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res,next) => {
    console.log(' ------------------------------- ERROR ------------------------------- ');
    if(req.file && req.file) fs.unlinkSync(publicDirPath+req.file.path);
    if(req.files && req.files.length > 0){
        req.files.forEach(file => {
            if(fs.existsSync(publicDirPath+file.path)) fs.unlinkSync(publicDirPath+file.path);
        });
    }
    console.log('err:', colors.red(err))
    /**Mongoose duplicate key error */
    if (err.code == 11000) {
        // err.message = env.ALREADY_EXIST
        err.status = 400
        let { keyValue, } = err;
        let size = Object.keys(keyValue).length;
        let count = 1;
        err.message = 'Duplicate value'
        for (const key in keyValue) {
            err.message += ` ${keyValue[key]}`;
            (count === size) ? '' : err.message += ',';
            count++;
        }
        err.message += ' in'
        count = 1;
        for (const key in keyValue) {
            err.message += ' ' + key;
            (count === size) ? err.message += '.' : err.message += ','
            count++;
        }
    }
    if(err.code === 'LIMIT_UNEXPECTED_FILE') err.message = 'Image uploading limit exceeded'
    return res.status(err.status || 500).json({ message: err.message || 'Unexpected error occurred!', error: err })
})

module.exports = app;

// const express = require('express')
// const logger = require('morgan')
// const colors = require('colors')
// const app = express()
// // app.set(9000)
// const mongoose = require('mongoose')
// const { MONGO_DB_CONFIG } = require('./config/app.config')
// const http = require('http')
// const server = http.createServer(app)
// const {initMeetingServer} = require('./meeting-server')
// initMeetingServer(server);
// mongoose.Promise = global.Promise
// const PORT = process.env.port || 9000

// mongoose.connect(MONGO_DB_CONFIG.DB,{
    
// }).then(()=>{
//     console.log('Database connected');
// }).catch((err)=>{
//     console.log('Database not connected', err)
// })


// app.use(express.json)
// app.use((request, response) => {
//     response.json({ message: 'Hey! This is your server response!' }); 
//  });
 
// app.use('/api',require('./routes/app.routes'))

// // logger.token('body', (req,res) => JSON.stringify(req.body, 0, 2));
// // app.use(logger(colors.green(':method '+colors.yellow(':url')+' :status :response-time ms - :res[content-length] ' +colors.blue(':body')+' - :req[content-length]')));

// server.listen(PORT,()=>{
//     console.log("Server start at",PORT);
//     console.log(`http://localhost:${PORT}`)
// })