const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    Sno: Number,
    StudentName: String,
    RegisterNumber: Number,
    Password: String,
    Section: String,
}, { collection: "students" });

module.exports = mongoose.model("Student", StudentSchema);
