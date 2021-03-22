const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

function Authenticate(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).render("login", { message: "All fields required" });
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(401).json(err);
    } else if (user) {
      // console.log(user, info);
      const token = user.generateJwt();
      // console.log(token);
      res
        .cookie("token", token)
        .redirect("/upload");
    } else {
      res.status(401).render("login", { message: "User do not Found." });
    }
  })(req, res);
}

//###################################

let checkToken = (req, res, next) => {
  let token = req.cookies.token; // Express headers are auto converted to lowercase
  // console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
       res.status(403).render("403")
      } else {
        req.decoded = decoded;
        // console.log(decoded);
        next();
      }
    });
  } else {
    return res.redirect("/login");
  }
};
let checkTokenHome = (req, res, next) => {
  let token = req.cookies.token; 
  // console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect("/login");
      } else {
        req.decoded = decoded;
        console.log(decoded);
        res.redirect("/upload");
      }
    });
  } else {
    return res.redirect("/login");
  }
};

module.exports = {
  Authenticate,
  checkToken,
  checkTokenHome,
};
