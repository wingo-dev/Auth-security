require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const salt = 10;
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
// encrypt part

// userSchema.plugin(encrypt, { secret: process.env.API_KEY, encryptedFields: ["password"] });

const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.email,
            password: hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render('secrets');
            }
        });
    });

});

app.post('/login', function (req, res) {
    const username = req.body.email;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    // result == true
                    if (result === true) {
                        res.render('secrets');
                    }
                });
            }
        }
    });
});


app.listen(3000, function () {
    console.log("Sever started on port 3000");
});