/*global process*/
require('dotenv-flow').config();

let env = {
    //ENV File
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    EmailId: process.env.EmailId,
    EmailPassword: process.env.EmailPassword,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    WEB_BASE_URL:process.env.WEB_BASE_URL,
    Logs:process.env.Logs,
    isAtlasUse:process.env.isAtlasUse,
    isLocalTunnelRun:process.env.isLocalTunnelRun,
}
const statuses = [1,2,3] // ["Pending","Rejected","Verified"]
const roles = [1,2] // ["admin","user"]
const models = ['tag','product']
module.exports = {env,statuses,roles,models};
// module.exports = status;