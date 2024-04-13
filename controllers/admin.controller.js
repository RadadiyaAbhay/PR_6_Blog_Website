const adminModel = require("../models/admin.model");
const fs = require('fs');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
let msg = "";

var admin;
const defaultRoute = async (req, res) => {
    console.log(req.user);
    const admin = req.user;

    if (admin) {
        res.render('index', { admin, messages: "" });
    } else {
        res.redirect('/signin')
    }
}
const signIn = (req, res) => {
    res.render('signin', { messages: "" });
}
const signUp = (req, res) => {
    res.render('signup');
}

const register = async (req, res) => {
    let { name, email, password } = req.body;
    try {
        const saltRounds = 11;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            let admin = new adminModel({
                name,
                email,
                password: hash
            });
            await admin.save();
            console.log("Admin Save Successfully");
            res.redirect('/signin');
        });

    } catch (err) {
        console.log(err);
        req.flash('err', 'Your password is Wrong');
        res.redirect('/signup');
    }
}

const login = (req, res) => {
    // const { email, password } = req.body;

    // try {
    //     adminModel.findOne({ email }).then((data) => {
    //         if (data != null) {
    //             bcrypt.compare(password, data.password, (err, result) => {
    //                 if (result) {
    //                     res.cookie('setId', data.id);
    //                     req.flash('success', 'You Login Successfully');
    //                     msg = req.flash('success');
    //                     console.log("login Successfully");
    //                     res.redirect('/')
    //                 } else {
    //                     res.redirect('/signin')
    //                 }
    //             });
    //         } else {
    //             console.log("user not found");
    //             res.redirect('/signup')

    //         }
    //     }).catch((err) => {
    //         console.log(err);
    //     })

    // } catch (err) {
    //     console.log(err);
    //     res.redirect('/signin')
    // }
    res.redirect('/');

}

const logout = (req, res) => {
    // res.clearCookie('connect.sid');
    req.logout((err) => {
        if (err) { res.redirect('/') };
        res.redirect('/signin');
    });
    // res.redirect('/signin');
}
const profile = async (req, res) => {
    const admin = req.user;

    if (admin) {
        res.render('profile', { admin });
    } else {
        res.redirect('/signin')
    }
}

const profileedit = async (req, res) => {
    const admin = req.user;
    res.render('profileedit', { admin });

}
const edituser = async (req, res) => {
    const admin = req.user;
    const { name, email, bio, designation } = req.body;
    const profile = req.file == null ? admin.profile : req.file.filename;
    if (req.file != null) {
        console.log("admin", admin);
        if (admin.profile != "user.png") {
            fs.unlinkSync(`./uploads/${admin.profile}`)
        }
    }
    await adminModel.findByIdAndUpdate(admin.id, {
        name,
        email,
        designation,
        bio,
        profile
    });

    res.redirect('/')


}

const changepassword = async (req, res) => {
    const admin = req.user;
    res.render('changepassword', { admin })
}
const passwordupdate = async (req, res) => {
    const { opassword, npassword, cpassword } = req.body;
    const admin = req.user;
    bcrypt.compare(opassword, admin.password, async (err, result) => {
        if (result) {
            if (npassword == cpassword) {
                const saltRounds = 11;
                bcrypt.hash(npassword, saltRounds, async (err, hash) => {
                    await adminModel.findByIdAndUpdate(admin.id, { password: hash });
                    res.redirect('/logout');
                });
            } else {
                console.log("confirm and new password not match.");
            }
        } else {
            console.log("old password is wrong");
        }
    });
}
module.exports = { signIn, signUp, register, login, defaultRoute, passwordupdate, logout, profile, profileedit, edituser, changepassword };

