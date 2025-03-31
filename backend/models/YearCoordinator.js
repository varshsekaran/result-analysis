const mongoose = require("mongoose");

const yearCoordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  section: { type: String, required: true }
}, { collection: "yearCoordinator" });

module.exports = mongoose.model("YearCoordinator", yearCoordinatorSchema);
