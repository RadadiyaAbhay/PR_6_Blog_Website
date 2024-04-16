const adminModel = require("../models/admin.model");
const tokenModel = require("../models/token.model");
const nodemailer = require('nodemailer');
const fs = require('fs');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
var randomToken = require('random-token');
let msg = "";
const otpGenerator = require('otp-generator')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 647,
    secure: true,
    auth: {
        user: 'vendeetechnology@gmail.com',
        pass: 'lsqfpsmqfxbxxkpw',
    }
});


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
            try{
                let admin = new adminModel({
                    name,
                    email,
                    password: hash
                });
                await admin.save();
            }catch(err){
            res.redirect('/signup');
            }
            console.log("Admin Save Successfully");
            res.redirect('/signin');
        });

    } catch (err) {
        console.log(err);
        req.flash('err', 'Your Email is in Use');
        res.redirect('/signup');
    }
}

const login = (req, res) => {
    res.redirect('/');

}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) { res.redirect('/') };
        res.redirect('/signin');
    });
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

const forgetpass = async (req, res) => {
    res.render('forgetpass');
}
const sendotp = async (req, res) => {
    let { id } = req.params
    res.render('sendotp', { userId: id });
}
const resetpass = async (req, res) => {
    let { id } = req.params
    if (id.length <= 16) {
        try {

            let token = await tokenModel.findOne({ tokenId: id })
            const vaildTime = new Date(token.createdAt);
            const currentDate = new Date();
            if (token != null) {
                var timeDiff = currentDate.getTime() - vaildTime.getTime();
                // To calculate the number of days, hours, minutes and seconds elapsed.
                var dt = new Date(timeDiff);

                var days = Math.floor(dt / 1000 / 60 / 60 / 24);
                var hrs = Math.floor((dt % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var mins = Math.round(((dt % (1000 *  60 * 60 * 24)) % (1000 *  60 * 60)) / (1000 * 60));
                if (days < 0 || hrs > 0 || mins >=  30) {
                    res.redirect('/forgetpass')
                }else{       
                    let user = await adminModel.findById(token.userId)
                    await tokenModel.deleteOne({ _id: token.id });
                    res.render('resetpass', { userId: user.id });
                }
            } else {
                res.redirect('/forgetpass')
            }
        } catch (err) {
            res.redirect('/forgetpass')
        }



    } else {
        res.render('resetpass', { userId: id });
    }
}
const email = (req, res) => {
    res.render('email');
}
const finduser = async (req, res) => {

    let { email, choice } = req.body;

    if (choice === "otp") {

        adminModel.findOne({ email }).then(async (user) => {
            if (user != null) {
                let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const mailOptions = {
                    from: 'vendeetechnology@gmail.com',
                    to: user.email,
                    subject: 'Reset Password OTP',
                    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                      <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Purple</a>
                      </div>
                      <p style="font-size:1.1em">Hi,</p>
                      <p>Thank you for choosing Purple. Use the following OTP to complete your Forget Password procedures. OTP is valid for 5 minutes</p>
                      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                      <p style="font-size:0.9em;">Regards,<br />Purple</p>
                      <hr style="border:none;border-top:1px solid #eee" />
                      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Purple Inc</p>
                        <p>1600 XYZ Road</p>
                        <p>India</p>
                      </div>
                    </div>
                  </div>`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                await adminModel.findByIdAndUpdate(user.id, { otp });
                res.redirect(`/sendotp/${user.id}`)
            } else {
                res.redirect('/forgetpass')
            }
        }).catch((err) => {
            res.redirect('/forgetpass', err)
        })
    } else {

        adminModel.findOne({ email }).then(async (user) => {
            if (user != null) {
                var token = randomToken(16);
                const mailOptions = {
                    from: 'vendeetechnology@gmail.com',
                    to: user.email,
                    subject: 'Reset Password Link',
                    html: `<div style="background-color:#f7f7f7; padding:30px 0 font-family:'roboto', 'Open Sans', 'helvetica', 'arial'" bgcolor="#f7f7f7">
    
                    <table dir="ltr" style="background-color:#ffffff; border:1px solid #ddd; box-shadow:1px 1px #ddd; border-collapse:collapse;margin:0 auto;min-width:320;max-width:560px;padding:0;z-index:10 " align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td style="padding:8px 32px 0px 32px; font-weight:400">
                            <p style="color:#555;font-size:24px;line-height:30px;padding:0px;text-align:left; font-weight:400">
                              <strong>P</strong>urple
                            </p>
                            <p style="color:#555;">
                              We received a request to reset the password associated with this e-mail address. If you made this request, please follow the instructions below.
                            </p>
                            <p style="color:#555;">
                              Click on the link below to reset your password using our secure server:
                            </p>
                            <p>
                              <a href="http://localhost:3000/resetpass/${token}" style="color:#a8501e;" target="_blank">http://localhost:3000/resetpass/${token}</a>
                            </p>
                            <p style="color:#555;">
                              If clicking the link does not seem to work, you can copy and paste the link into your browser's address window, or retype it there.
                            </p>
                            <p style="color:#555; font-weight:500;">
                              Thank You!
                            </p>
                            
                          </td>
                        </tr>
                              
                        <tr>
                          <td style="padding:32px 32px 32px 32px; background-color:#f9f9f9;font-size:small">
                            <address style="font-style:normal">
                              Purple, 123 ,XYZ Road, Surat ,  10038
                            </address>
                            <div style="color:#5e5656;">
                              +49-XX-XXXXXXXX
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  `,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                console.log("token", token);
                console.log("user", user.id);
                let newToken = new tokenModel({
                    tokenId: token,
                    userId: user.id
                });
                await newToken.save();
                res.redirect('/email')
            } else {
                res.redirect('/forgetpass')
            }
        }).catch((err) => {
            res.redirect('/forgetpass', err)
        })
    }

}
const otpvalidation = async (req, res) => {
    let userOtp = req.body.otp;
    let { userId } = req.body;
    let user = await adminModel.findById(userId)
    console.log(user);
    if (user.otp == userOtp) {
        res.redirect(`/resetpass/${userId}`)
    } else {
        await adminModel.findByIdAndUpdate(userId, { otp: '' });
        res.redirect('/forgetpass')
    }
}
const getresetpass = async (req, res) => {
    let { newpass, conpass, userId } = req.body;
    if (false) {


    } else {
        if (newpass === conpass) {
            const saltRounds = 11;
            bcrypt.hash(newpass, saltRounds, async (err, hash) => {
                await adminModel.findByIdAndUpdate(userId, { password: hash, otp: '' });
                res.redirect('/signin');
            });
        } else {
            res.redirect(`/resetpass/${userId}`)

        }
    }
}
module.exports = { signIn, signUp, register, login, defaultRoute, passwordupdate, logout, profile, profileedit, edituser, changepassword, forgetpass, sendotp, resetpass, finduser, otpvalidation, getresetpass, email };

