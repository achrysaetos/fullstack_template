
const { check, validationResult } = require("express-validator");//after we npm install express-validator
const bcrypt = require("bcryptjs");//after we npm install bcryptjs
const jwt = require("jsonwebtoken");//after we install jsonwebtoken

var User = require("../models/user");



exports.home = function (req, res) {
    res.render("index");
};
exports.products = function (req, res) {
    res.render("products");
};
exports.features = function (req, res) {
    res.render("features");
};
exports.pricing = function (req, res) {
    res.render("pricing");
};
exports.about = function (req, res) {
    res.render("about");
};
exports.contact_us = function (req, res) {
    res.render("contact_us");
};
exports.signup = function (req, res) {
    res.render("signup");
};
exports.login = function (req, res) {
    res.render("login");
};
exports.forgot = function (req, res) {
    res.render("forgot");
};
exports.dashboard = function (req, res) {
    res.redirect("login");
};



exports.signup_post = async (req, res) => {
    const { uname, fname, lname, pword } = req.body;
    try {
        let user = await User.findOne({
            uname
        });
        if (user) {
            return res.status(400).json({
                msg: "User Already Exists"
            });
        }

        user = new User({ uname, fname, lname, pword });

        const salt = await bcrypt.genSalt(10);
        user.pword = await bcrypt.hash(pword, salt);

        await user.save(function (err) {
            if (err) { return next(err); }
            res.render("login");
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
};

exports.login_post = async (req, res) => {
    const { uname, pword } = req.body;
    try {
        let user = await User.findOne({
            uname
        });
        if (!user)
            return res.status(400).json({
                message: "User Does Not Exist"
            });

        const isMatch = await bcrypt.compare(pword, user.pword);
        if (!isMatch)
            return res.status(400).json({
                message: "Incorrect Password!"
            });
        await res.render("dashboard");

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
