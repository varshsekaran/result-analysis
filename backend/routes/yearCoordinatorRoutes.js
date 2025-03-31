const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const YearCoordinator = require("../models/YearCoordinator");
const Marks = require("../models/Marks");
const FacultySubjects = require("../models/FacultySubjects"); // Import model
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/subjects", authMiddleware, async (req, res) => {
  try {
    const subjects = await FacultySubjects.aggregate([
      {
        $group: {
          _id: "$SubjectCode",
          SubjectName: { $first: "$SubjectName" },
          Section: { $first: "$Section" },
          Faculty: { $first: "$name" }
        }
      }
    ]);

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
});
// Year Coordinator Registration
router.post("/register", async (req, res) => {
    const { name, email, password, section } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCoordinator = new YearCoordinator({ name, email, password: hashedPassword, section });
        await newCoordinator.save();
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// Year Coordinator Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const coordinator = await YearCoordinator.findOne({ email });
        if (!coordinator) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, coordinator.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: coordinator._id }, "7e67ff4d75c420c0086fb98f22e53fd080472cdf4ef5812a7bb8587a26b030aa", { expiresIn: "1h" });
        res.json({ token, section: coordinator.section });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
});

router.get("/marks/:subjectId/:section", authMiddleware, async (req, res) => {
  try {
    const { subjectId, section } = req.params;
    const marks = await Marks.find({ SubjectCode: subjectId, Section: section });

    res.json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Failed to fetch marks" });
  }
});

module.exports = router;
