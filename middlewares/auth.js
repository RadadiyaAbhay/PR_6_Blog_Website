const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const adminModel = require('../models/admin.model'); // Make sure to adjust the path

const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const data = await adminModel.findOne({ email });

        if (!data) {
          console.log('User not found');
          return done(null, false);
        }

        bcrypt.compare(password, data.password, (err, result) => {
          if (err) {
            return done(err);
          }

          if (result) {
            console.log('Login successful');
            return done(null, data);
          } else {
            console.log('Incorrect password');
            return done(null, false);
          }
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((admin, done) => {
  // console.log('User serialize...', admin);
  done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await adminModel.findById(id);
    if (!admin) {
      return done(null, false);
    }
    return done(null, admin);
  } catch (error) {
    return done(error);
  }
});

module.exports = passport;
