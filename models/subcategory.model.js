const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const subcategoryModel = mongoose.model("subcategory", subcategorySchema);
module.exports = subcategoryModel;