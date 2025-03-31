const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Marks = require("../models/Marks");


const router = express.Router();

// Student Login
router.post("/login", async (req, res) => {
    

    try {
        const { RegisterNumber, Password } = req.body;
        console.log("Login attempt for:", RegisterNumber);

        // Check if registerNumber is valid
        if (!RegisterNumber || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find student by register number
        const student = await Student.findOne({ RegisterNumber: Number(req.body.RegisterNumber) });

        if (!student) {
            console.log("Student not found.");
            return res.status(404).json({ message: "Student not found" });
        }

        console.log("Stored Password:", student.Password);  // Debugging
        console.log("Entered Password:", Password);  // Debugging

        // Compare passwords (hashed vs entered)
        if (student.Password.trim() === Password.trim()) {
            return res.status(200).json({ message: "Login successful" });
        } else {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.get("/marks/:registerNumber", async (req, res) => {
    try {
        const registerNumber = Number(req.params.registerNumber); // Extract and convert it to Number

        if (!registerNumber) {
            return res.status(400).json({ message: "Register number is required" });
        }

        console.log("Fetching marks for:", registerNumber);  // Debugging

        const marks = await Marks.find({  RegisterNumber: registerNumber });
        if (marks.length === 0) {
            return res.status(404).json({ message: "No marks found" });
        }

        res.json(marks);
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/api/students", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        console.log("Searching for student with query:", query); // Debugging

        // Search by RegisterNumber or StudentName
        const students = await Student.find({
            $or: [
                { RegisterNumber: !isNaN(query) ? Number(query) : undefined },
                { StudentName: { $regex: query, $options: "i" } }
            ]
        });

        if (students.length === 0) {
            return res.status(404).json({ message: "No student found" });
        }

        res.json(students);
    } catch (error) {
        console.error("Error searching students:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

  

module.exports = router;