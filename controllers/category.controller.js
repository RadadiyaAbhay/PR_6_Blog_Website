const adminModel = require('./../models/admin.model');
const categoryModel = require('./../models/category.model');
const subcategoryModel = require('./../models/subcategory.model');
let admin;

const viewcategory = async (req, res) => {
    const admin = req.user;

    let category = await categoryModel.find({});
    let subcategory = await subcategoryModel.find({});
    


    res.render('viewcategory' ,{category ,subcategory ,admin});
}

const addcategory = async (req, res) => {
    const admin = req.user;
    
    let category = await categoryModel.find({});
    res.render('addcategory', { admin, category });
}
const insertcategory = async (req, res) => {
    let { title } = req.body;

    const category = new categoryModel({
        title
    });

    await category.save();
    res.redirect('/addcategory');
}

const insertsubcategory = async (req, res) => {
    let { title, categoryId } = req.body;

    const subcategory = new subcategoryModel({
        title,
        categoryId
    });

    await subcategory.save();
    res.redirect('/addcategory');
}

const deletecategory = async (req , res) =>{
    const { id } = req.params;
    await categoryModel.deleteOne({ _id: id })
    res.redirect('/viewcategory')
}
const deletesubcategory = async (req , res) =>{
    const { id } = req.params;
    await subcategoryModel.deleteOne({ _id: id })
    res.redirect('/viewcategory')
}
const editcategory = async (req ,res) =>{
    const { id } = req.params;
    const admin = req.user;
    
    let category = await categoryModel.findOne({_id : id});
    res.render('editcategory', {admin , category});  

}
const editsubcategory = async (req ,res) =>{
    const { id } = req.params;
    const admin = req.user;
    
    let subcategory = await subcategoryModel.findOne({_id : id});
    res.render('editsubcategory', {admin , subcategory});  
}

const updatesubcategory = async (req ,res) =>{
    const { id ,title } = req.body;
    await  subcategoryModel.findByIdAndUpdate(id,{
        title
    })
    res.redirect('/viewcategory')
}
const updatecategory = async (req ,res) =>{
    const { id ,title } = req.body;
    await  categoryModel.findByIdAndUpdate(id,{
        title
    })
    res.redirect('/viewcategory')
}
module.exports = { addcategory, insertcategory, insertsubcategory, viewcategory ,deletecategory ,deletesubcategory , editcategory , editsubcategory , updatesubcategory , updatecategory}