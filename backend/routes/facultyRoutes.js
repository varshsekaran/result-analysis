const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/Faculty");
const FacultySubjects = require("../models/FacultySubjects"); 

const router = express.Router();


// Call CSV import only when the script runs (not on every request)


// Faculty Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if faculty already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ message: "Faculty already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save Faculty in DB
        const faculty = new Faculty({ name, email, password: hashedPassword });
        await faculty.save();

        res.status(201).json({ message: "Faculty registered successfully" });
    } catch (error) {
        console.error("Error registering faculty:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Faculty Login
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      // Check if faculty exists
      const faculty = await Faculty.findOne({ email });
      if (!faculty) {
          return res.status(404).json({ message: "Faculty not found" });
      }

      // Validate Password
      const isPasswordValid = await bcrypt.compare(password, faculty.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign({ id: faculty._id, email: faculty.email }, "secretkey", { expiresIn: "1h" });

      res.json({ message: "Login successful", token,facultyName: faculty.name});
  } catch (error) {
      console.error("Error logging in faculty:", error);
      res.status(500).json({ message: "Server error" });
  }
});

router.get("/faculty-subjects/:name", async (req, res) => {
  try {
      const facultyName = req.params.name.trim();  // Fix: Define facultyName first
      console.log("Received Faculty Name:", facultyName); 

      if (!facultyName) {
          return res.status(400).json({ message: "Faculty name is missing!" });
      }

      // Case-insensitive search for faculty subjects
      const subjects = await FacultySubjects.find({ name: { $regex: new RegExp(`^${facultyName}$`, "i") } });
      console.log("Subjects Found:", subjects);

      
      

      if (!subjects || subjects.length === 0) {
          return res.status(404).json({ message: "No subjects found for this faculty." });
      }

      res.json(subjects);
  } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Error fetching subjects" });
  }
})

module.exports = router;