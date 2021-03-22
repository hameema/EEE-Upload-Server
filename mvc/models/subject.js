const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
	name: String,
	subject_id: String,
})


mongoose.model('Subject', subjectSchema);
