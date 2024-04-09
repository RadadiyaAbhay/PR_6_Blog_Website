const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }

}, { timestamps: true });

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;