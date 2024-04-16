const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const tokenModel = mongoose.model("token", tokenSchema);
module.exports = tokenModel;