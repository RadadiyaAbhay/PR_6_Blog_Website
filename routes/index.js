const express = require('express');
const routes = express.Router();
const adminController = require('./../controllers/admin.controller')
const blogController = require('./../controllers/blog.controller')
const categoryController = require('./../controllers/category.controller')
const upload = require('./../middlewares/multer');
const passport = require('../middlewares/auth');


routes.get('/', adminController.defaultRoute)
routes.get('/signin', adminController.signIn)
routes.get('/signup', adminController.signUp)
routes.post('/register', adminController.register)
routes.get('/logout', adminController.logout)
routes.post('/login', passport.authenticate('local',{ failureRedirect:'/signin'}), adminController.login);


routes.get('/profile', adminController.profile)
routes.get('/profileedit', adminController.profileedit)
routes.get('/changepassword', adminController.changepassword)
routes.post('/passwordupdate', adminController.passwordupdate)
routes.post('/edituser', upload.single('profile') , adminController.edituser)


routes.get('/blogadd', blogController.blogadd)
routes.get('/viewallpost', blogController.viewallpost)
routes.get('/viewuserpost', blogController.viewuserpost)
routes.get('/deletepost/:id', blogController.deletepost)
routes.get('/edit/:id', blogController.edit)
routes.post('/addblog', upload.array('images',12) , blogController.addBlog)
routes.post('/editblog', upload.array('images',12) , blogController.editBlog)

routes.get('/viewcategory' , categoryController.viewcategory);
routes.get('/addcategory' , categoryController.addcategory);
routes.get('/deletecategory/:id' , categoryController.deletecategory);
routes.get('/deletesubcategory/:id' , categoryController.deletesubcategory);
routes.get('/editcategory/:id' , categoryController.editcategory);
routes.get('/editsubcategory/:id' , categoryController.editsubcategory);
routes.post('/insertcategory' , categoryController.insertcategory);
routes.post('/insertsubcategory' , categoryController.insertsubcategory);
routes.post('/updatecategory' , categoryController.updatecategory);
routes.post('/updatesubcategory' , categoryController.updatesubcategory);
module.exports = routes;