const mongoose = require("mongoose");

const FacultySubjectsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    SubjectCode: { type: String, required: true },
    SubjectName: { type: String, required: true },
    Section: { type: String, required: true }
} ,{ collection: "faculty-subjects" });

module.exports = mongoose.model("FacultySubjects", FacultySubjectsSchema);
