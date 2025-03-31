const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed Password
    section: { type: String },
}, { collection: "faculty" });

module.exports = mongoose.model("Faculty", facultySchema);