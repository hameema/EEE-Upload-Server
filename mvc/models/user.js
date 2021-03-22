const mongoose = require("mongoose");
const JWT = require('jsonwebtoken');
const File = require('./file');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	// salt: String,
	// hash: String,
	privileges: {
		type:String,
		default: "Admin"
	},
	privilegesList:{
		type: [String],
		default: []
	},
	FileList: [File],
	password:String,
});

userSchema.methods.setPassword = function (password) {
	// this.salt = crypto.randomBytes(16).toString("hex");
	// this.hash = crypto
	// 	.pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
	// 	.toString("hex");
	this.password = password;
};

userSchema.methods.checkPassword = function (password) {
	// let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
	return this.password === password;
};

userSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);
  return JWT.sign(
    {
      _id: this._id,
      name: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "6h",
    }
  );
};

mongoose.model("User", userSchema);
