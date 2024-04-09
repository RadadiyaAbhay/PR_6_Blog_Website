const express = require('express');
const db = require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const routes = require('./routes/index');
let session = require('express-session');
let flash = require('connect-flash');

app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(flash());
app.use('/', routes)
app.use(express.static('public'))
app.use(express.static('uploads'))
app.listen(port, () => {
    console.log("Server is running on port " + port);
})