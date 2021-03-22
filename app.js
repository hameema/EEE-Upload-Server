"use strict";
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("./mvc/config/db");
require("./mvc/config/passport");

const uploadRouter = require("./mvc/routes/upload");
const loginRouter = require("./mvc/routes/users");
const authCtrl = require("./mvc/controllers/authenticate");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "mvc/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

app.use("/", loginRouter);

app.use(authCtrl.checkToken);
app.use("/", uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
