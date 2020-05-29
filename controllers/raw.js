const { check, validationResult } = require("express-validator/check");//after we npm install express-validator
const bcrypt = require("bcryptjs");//after we npm install bcryptjs
const jwt = require("jsonwebtoken");//after we install jsonwebtoken

var User = require("../models/user");

exports.signup_post = (
    [
        check("username", "Please Enter a Valid Username")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            uname,
            fname,
            lname,
            pword
        } = req.body;
        try {
            let user = await User.findOne({
                uname
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                uname,
                fname,
                lname,
                pword
            });

            const salt = await bcrypt.genSalt(10);
            user.pword = await bcrypt.hash(pword, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                expiresIn: 10000
            },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

exports.login_post = (
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { uname, pword } = req.body;
        try {
            let user = await User.findOne({
                uname
            });
            if (!user)
                return res.status(400).json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(pword, user.pword);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

exports.dashboard = function (req, res, next) {
    const token = req.header("token");
    if (!token) return res.status(401).json({ message: "Auth Error" });

    try {
        const decoded = jwt.verify(token, "randomString");
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Invalid Token" });
    }
}, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
};













































exports.home = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('dashboard');
    } else {
        next();
    }
}, function (req, res) {
    res.redirect("login");
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
exports.signup = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('dashboard');
    } else {
        next();
    }
}, function (req, res) {
    res.render("signup");
};
exports.login = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('dashboard');
    } else {
        next();
    }
}, function (req, res) {
    res.render("login");
};
exports.forgot = function (req, res) {
    res.render("forgot");
};
exports.dashboard = function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.render("dashboard");
    } else {
        res.redirect('login');
    }
};

exports.signup_post = (req, res) => {
    User.create({
        uname: req.body.uname,
        fname: req.body.fnamme,
        lname: req.body.lname,
        pword: req.body.pword
    })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('dashboard');
        })
        .catch(error => {
            res.redirect('signup');
        });
};
exports.login_post = (req, res) => {
    var uname = req.body.uname,
        pword = req.body.pword;

    User.findOne({ where: { uname: uname } }).then(function (user) {
        if (!user) {
            res.redirect('login');
        } else if (!user.validPassword(pword)) {
            res.redirect('login');
        } else {
            req.session.user = user.dataValues;
            res.redirect('dashboard');
        }
    });
};