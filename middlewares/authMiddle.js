const authMiddle = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/signin')
    }
};

module.exports = authMiddle;
