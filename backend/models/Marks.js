const mongoose = require("mongoose");

const  marksSchema = new mongoose.Schema({
    RegisterNumber: Number,
    Sno: Number,
    SubjectCode: String,
    SubjectName: String,
    CAE: Number,
    Max: Number,
    Obtained: String,
    Results: String,
    StudentName: String,
    Section: String
},{ collection: "student-marks" });


module.exports = mongoose.model("Marks", marksSchema);