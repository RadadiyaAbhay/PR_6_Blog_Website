const blogModel = require('./../models/blog.model');
const adminModel = require('./../models/admin.model');
const categoryModel = require('./../models/category.model');
const subcategoryModel = require('./../models/subcategory.model');

const fs = require('fs')

var admin;
const blogadd = async (req, res) => {
    const { setId } = req.cookies;
    
    if (setId) {
        admin = await adminModel.findById(setId);
        let category = await categoryModel.find({});
        let subcategory = await subcategoryModel.find({});
        // localStorage.setItem('categoryId', JSON.stringify(subcategory));
        res.render('blogadd', { admin, category, subcategory });
    } else {
        res.redirect('/signin')
    }
}
const viewallpost = async (req, res) => {
    let blogs = await blogModel.find();
    const { setId } = req.cookies;
    admin = await adminModel.findById(setId);
    let newData = [];
    for (let index = 0; index < blogs.length; index++) {
        const blog = blogs[index];
        let author = await adminModel.findById(blog.userId);
        let category = await categoryModel.findById(blog.category);
        let subcategory = await subcategoryModel.findById(blog.subcategory);
        try {

            newData.push({ blog, category: { title: category.title }, subcategory: { title: subcategory.title }, author: { name: author.name, designation: author.designation, profile: author.profile } });
        } catch (err) {
            console.log(err);
        }
    }
    res.render('viewallpost', { admin, newData });
}
const viewuserpost = async (req, res) => {
    const { setId } = req.cookies;
    let blog = await blogModel.find({ userId: setId });
    admin = await adminModel.findById(setId);
    res.render('viewuserpost', { admin, blog });
}

const addBlog = async (req, res) => {
    const { title, content, category, description, subcategory } = req.body;
    const { setId } = req.cookies;
    admin = await adminModel.findById(setId);
    const images = [];
    req.files.forEach(element => {
        images.push(element.filename);
    });

    const blog = new blogModel({
        title,
        images,
        content,
        category,
        description,
        userId: admin._id,
        subcategory
    })

    await blog.save();
    res.redirect('/viewuserpost');
}
const deletepost = async (req, res) => {
    const { id } = req.params;
    const blog = await blogModel.findOne({ _id: id })

    try {
        blog.images.map((img) => {
            fs.unlinkSync(`./uploads/${img}`)
        })
    } catch (err) {
        console.log("img not delete");
    }
    await blogModel.deleteOne({ _id: id })
    res.redirect('/viewuserpost')
}

const edit = async (req, res) => {
    const { id } = req.params;
    const blog = await blogModel.findOne({ _id: id })
    let category = await categoryModel.find({});
    let subcategory = await subcategoryModel.find({});
    const { setId } = req.cookies;
    admin = await adminModel.findById(setId);
    res.render("edit", { admin, blog, category, subcategory });
}
const editBlog = async (req, res) => {
    const { title, content, category, description, id, subcategory } = req.body;
    let imagess = [];
    let pastBlog = await blogModel.findOne({ _id: id });
    req.files.forEach(element => {
        imagess.push(element.filename);
    });

    if (imagess.length == 0) {

        imagess = pastBlog.images
    } else {
        try {
            pastBlog.images.map((img) => {
                fs.unlinkSync(`./uploads/${img}`)
            })
        } catch (err) {
            console.log("img not delete");
        }
    }

    const blog = {
        title,
        images: imagess,
        content,
        category,
        description,
        subcategory
    }

    await blogModel.findByIdAndUpdate(id, blog);
    res.redirect('/viewuserpost');
}
module.exports = { blogadd, addBlog, viewuserpost, viewallpost, deletepost, edit, editBlog };