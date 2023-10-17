// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,

    },

    password: {
        type:String,
    }
})
const UserModel = mongoose.model('UserModel', UserSchema)
// module.exports = UserModel
export default UserModel;