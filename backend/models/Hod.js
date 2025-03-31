const mongoose = require("mongoose");

const hodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { collection: "hod" });

module.exports = mongoose.model("Hod", hodSchema);
