const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authenticate");
const userCtrl = require("../controllers/user");

/* GET users listing. */
router.get("/", authCtrl.checkTokenHome, function (req, res, next) {
  res.redirect("/login");
});

router
  .route("/login")
  .get(function (req, res, next) {
    res.render("login", { message: "" });
  })
  .post(authCtrl.Authenticate);

router
	.route('/register')
  .get(authCtrl.checkToken, userCtrl.renderRegisterPage)
  .post(userCtrl.Register);

module.exports = router;
