var express = require('express');
var router = express.Router();

//Require controller modules
var goto = require("../controllers/goto");

//Routes
router.get("/", goto.home);
router.get("/products", goto.products);
router.get("/features", goto.features);
router.get("/pricing", goto.pricing);
router.get("/about", goto.about);
router.get("/contact_us", goto.contact_us);
router.get("/signup", goto.signup);
router.get("/login", goto.login);
router.get("/forgot", goto.forgot);

router.post("/login", goto.signup_post);
router.post("/dashboard", goto.login_post);
router.post("/logout", goto.logout);

router.get("/dashboard", goto.dashboard);
router.get("/logout", goto.logout);

module.exports = router;
