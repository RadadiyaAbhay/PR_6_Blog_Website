const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: false
    },
    profile :{
        type: String,
        required: false,
        default : 'user.png'
    }

}, { timestamps: true });

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;