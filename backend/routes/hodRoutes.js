const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HOD = require("../models/Hod")
const StudentMarks = require("../models/Marks"); // Ensure the correct path to your model

const router = express.Router();

// HOD Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if HOD already exists
    let hod = await HOD.findOne({ email });
    if (hod) {
      return res.status(400).json({ message: "HOD already registered!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HOD
    hod = new HOD({
      name,
      email,
      password: hashedPassword,
    });

    await hod.save();
    res.status(201).json({ message: "HOD registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// HOD Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find HOD by email
    const hod = await HOD.findOne({ email });
    if (!hod) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, hod.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: hod._id }, "your_secret_key", { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

router.get("/subjects", async (req, res) => {
    try {
      const subjects = await StudentMarks.aggregate([
        {
          $group: {
            _id: "$SubjectName", // Group by subject name
            sections: { $addToSet: "$Section" }, // Collect unique sections for each subject
          },
        },
        {
          $project: {
            _id: 0,
            subject: "$_id",
            sections: 1,
          },
        },
      ]);
  
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

module.exports = router;
