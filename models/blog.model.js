const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content : {type: String, required : true},
    category :{type : String , required : true},
    subcategory :{type : String , required : true},
    userId :{type : String , required : true},
    images :{type : Array, required : true},
    description : {type : String, required : true}
},
{
    timestamps : true
})

const blogModel = mongoose.model("blogs" , blogSchema);

module.exports = blogModel;