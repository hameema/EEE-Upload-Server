const express = require("express");
const router = express.Router();
const uploadCtrl = require("../controllers/upload");

router
  .get("/upload", uploadCtrl.renderUploadPage)
  .get("/upload/:subjectID/:fileType", (req, res, next) => {
    res.redirect("/upload");
  })
  .post(
    "/upload/:subjectID/:fileType",
    uploadCtrl.Upload
  );

module.exports = router;
