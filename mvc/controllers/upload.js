const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const File = mongoose.model("File");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");



function Upload(req, res) {
  let subjectID = req.params.subjectID;
  let fileType = req.params.fileType;
  let owner = req.decoded.name;
  let upload_path = path.join(process.env.UPLOAD_PATH, subjectID, fileType);
  let message = "";
  let fileName = "";
  const FileData = {
    subjectID,
    fileType,
    owner,
    fileName,
  }

  try {
    if (!fs.existsSync(upload_path)) {
      fs.mkdirSync(upload_path, {
        recursive: true,
      });
    }
  } catch (error) {
    // console.log(error);
  }

  console.log(upload_path);
  console.log(fs.existsSync(upload_path));
  const form = new formidable({
    multiples: true,
    uploadDir: upload_path,
    maxFileSize: 2 * 1024 * 1024 * 1024,
    keepExtension: true,
  });

  form
    .on("fileBegin", (name, file) => {
      file.path = path.join(upload_path, file.name);
    })
    .on("file", async (fileName, file) => {
      fileName = file.name;
      await saveFile(FileData);
    })
    .on("end", () => {
      console.log("======> upload done");
      message = "Upload Complete";
    });
  form.parse(req);
  res.status(200).send(message);
}


async function saveFile(data) {
  const file = new File();
  file.owner = data.owner;
  file.subject = data.subjectID;
  file.fileType = data.fileType;
  file.name = data.fileName;
  await file.save();
  console.log(data)
}

function renderUploadPage(req, res) {
  User.findOne({ username: req.decoded.name }, (err, user) => {
    if (err) {
      console.error(err);
    }
    if (user) {
      let subjects = user.privilegesList;
      console.log(req.params);
      console.log(req.body);
      res.render("upload", { subjects: subjects });
    }
  });
}

module.exports = {
  renderUploadPage,
  Upload,
};
