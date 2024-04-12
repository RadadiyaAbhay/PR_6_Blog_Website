const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const adminModel = require('../models/admin.model');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
    // the
},
    function(email, password, done) {
      adminModel.findOne({ email }).then((data) => {
        if (data != null) {
            bcrypt.compare(password, data.password, (err, result) => {
                if (result) {
                    // res.cookie('setId', data.id);
                    // req.flash('success', 'You Login Successfully');
                    // msg = req.flash('success');
                    console.log("login Successfully");
                    return done(null, data);
                } else {
                    return done(null, false);
                }
            });
        } else {
            console.log("user not found");
            return done(null, false)

        }
    }).catch((err) => {

        return done(err);
    })
    }
  ));

  passport.serializeUser((admin, done)=>{
    console.log("User serialize...", admin);
       done(null, admin.id)

  });

  passport.deserializeUser((id,done)=>{
    console.log("User deserialize...");
    adminModel.findById(id).then((admin)=> {
      return done(null, admin);
    })
    .catch((err)=> {
      return done(err, null);
    }
  );

  }) ;

  module.exports = passport;


