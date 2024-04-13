const express = require('express');
const routes = express.Router();
const adminController = require('./../controllers/admin.controller')
const blogController = require('./../controllers/blog.controller')
const categoryController = require('./../controllers/category.controller')
const upload = require('./../middlewares/multer');
const passport = require('../middlewares/auth');
const authMiddle = require('../middlewares/authMiddle');



routes.get('/',authMiddle, adminController.defaultRoute)
routes.get('/signin', adminController.signIn)
routes.get('/signup', adminController.signUp)
routes.post('/register', adminController.register)
routes.get('/logout', adminController.logout)
routes.post('/login', passport.authenticate('local',{ failureRedirect:'/signin'}), adminController.login);


routes.get('/profile',authMiddle, adminController.profile)
routes.get('/profileedit',authMiddle, adminController.profileedit)
routes.get('/changepassword',authMiddle, adminController.changepassword)
routes.post('/passwordupdate', adminController.passwordupdate)
routes.post('/edituser', upload.single('profile') , adminController.edituser)


routes.get('/blogadd',authMiddle, blogController.blogadd)
routes.get('/viewallpost',authMiddle, blogController.viewallpost)
routes.get('/viewuserpost',authMiddle, blogController.viewuserpost)
routes.get('/deletepost/:id',authMiddle, blogController.deletepost)
routes.get('/edit/:id',authMiddle, blogController.edit)
routes.post('/addblog', upload.array('images',12) , blogController.addBlog)
routes.post('/editblog', upload.array('images',12) , blogController.editBlog)

routes.get('/viewcategory' ,authMiddle, categoryController.viewcategory);
routes.get('/addcategory' ,authMiddle, categoryController.addcategory);
routes.get('/deletecategory/:id' ,authMiddle, categoryController.deletecategory);
routes.get('/deletesubcategory/:id' ,authMiddle, categoryController.deletesubcategory);
routes.get('/editcategory/:id' ,authMiddle, categoryController.editcategory);
routes.get('/editsubcategory/:id' ,authMiddle, categoryController.editsubcategory);
routes.post('/insertcategory' , categoryController.insertcategory);
routes.post('/insertsubcategory' , categoryController.insertsubcategory);
routes.post('/updatecategory' , categoryController.updatecategory);
routes.post('/updatesubcategory' , categoryController.updatesubcategory);
module.exports = routes;