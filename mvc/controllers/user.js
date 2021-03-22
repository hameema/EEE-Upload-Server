const { render } = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Subject = mongoose.model("Subject");

function renderRegisterPage(req, res) {
  console.log(req.decoded);
  User.findOne({ username: req.decoded.name }, (err, user) => {
    if (err) {
      console.log(err);
    }

    if (user.privileges === "SuperAdmin") {
        res.render("register", {
          message: `Welcome back ${req.decoded.name}`
        });
    } else {
      res.status(403).render("403");
    }
  });
}

function Register(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let subjects = req.body.subjects;
  console.log(subjects);
  User.find({ username: username }, (err, user) => {
    if(err) {console.log(err);}
    else if (user.username) {
      console.log(`user: ${user.username}`);
      res.render("register", { message: "User Already Exists" });
    }else{
      let newUser = new User();
      newUser.username = username;
      newUser.setPassword(password);
      newUser.privilegesList = subjects;
      // console.log(newUser.privilegesList);

        newUser.save((err) => {
          if (err) {
            res.status(500).json(err);
          } else {
            res.render("register", {
              message: "User has been added successfully.",
            });
          }
        });
    }
  });

}

module.exports = {
  renderRegisterPage,
  Register,
};
