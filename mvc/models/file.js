const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
	name: [String],
	owner: String,
	subject: String,
	fileType: String,
	note: {
		type: String,
		default: "",
	},
	dateCreatedOn: {
		type: String,
		default: Date.now(),
	}
});

mongoose.model("File", fileSchema);
