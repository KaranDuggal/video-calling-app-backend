// const Joi = require('joi');
// require('dotenv-flow').config();

const CMSMessages = {
    // AUTH messages
    AUTH_SIGNUP: 'Signup successfully',
    AUTH_LOGIN: 'Login successfully',
    AUTH_VERIFY: 'Verify Successfully',
    AUTH_PASSWORD_SET: 'Password Set successfully',
    AUTH_FORGET_PASSWORD: 'Forget password mail send successfully',
    AUTH_PASSWORD_NOT_MATCH: 'Password not match',
    AUTH_INVALID_TOKEN: 'Invalid token',
    AUTH_INVALID_OTP: 'Invalid OTP',
    AUTH_VERIFY_OTP: 'Verify Successfully',
    // USER Messages
    USER_ALREADY_EXIST: 'This user Already exist',
    USER_GET: 'user get Successfully',
    USER_NOT_EXIST: 'This user not exist',
    USER_NOT_VERIFY: 'This user not verify',
    USER_REJECTED: 'This user Rejected by admin',
    USER_PASSWORD_NOT_SET: 'Please set password For Login',
    GET:'Get Successfully',
    ADD:'Add Successfully',
    UPDATE:'Edit Successfully',
    DELETE:'Delete Successfully',
    ALREADY_EXIST:'Already Exist',
    NOT_EXIST:'Not Exist',
    INVALID_ID: 'Invalid object Id',
    INVALID_CREDENTIALS: 'Invalid Credentials',
}
module.exports = CMSMessages;