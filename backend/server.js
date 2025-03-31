const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const StudentMarks = require("./models/Marks")
const Student = require("./models/Student"); // Import Student model



dotenv.config();
const app = express();

app.use(express.json()); // Middleware to handle JSON data
app.use(cors()); // Allow frontend access

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Import Routes
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const hodRoutes = require("./routes/hodRoutes");
const yearCoordinatorRoutes = require("./routes/yearCoordinatorRoutes");

app.use("/api/year-coordinator", yearCoordinatorRoutes);
// Use Routes
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/hod", hodRoutes);



app.get("/api/student-marks/:subject/:section/:cae", async (req, res) => {
  console.log("Received Subject:", req.params.subject);
  console.log("Received Section:", req.params.section);
  console.log("Received CAE:", req.params.cae);
  try {
    const { subject, section , cae} = req.params;
    
    

    console.log(`Fetching student marks for subject: ${subject}, section: ${section}, CAE: ${cae}`);
    const students = await Student.find({ Section: section  },{ RegisterNumber: 1, StudentName: 1, _id: 0 }).lean(); // MongoDB Query
    console.log("Students found:", students);

      if (students.length === 0) {
          return res.status(404).json({ message: "No students found for this subject and section." });
      }
    
      const registerNumbers = students.map((student) =>  Number(student.RegisterNumber));

      console.log("Register numbers:", registerNumbers);

      const marksData = await StudentMarks.find(
        { SubjectName: subject,  Section: section, CAE: parseInt(cae),RegisterNumber: { $in: registerNumbers }  },  // ✅ Match subject
        { RegisterNumber: 1, Obtained: 1, Results: 1, _id: 0 } // ✅ Include name in response
    ).lean();

console.log("Aggregated Marks Data:", marksData);
    
  
      if (!marksData.length) {
        return res.status(404).json({ message: "No student marks found for this subject and section." });
      }
      const result = marksData
      .filter(mark => students.some(s => s.RegisterNumber === mark.RegisterNumber))  // ✅ Ensure student exists in A1
  .map(mark => {
        const student = students.find(s => s.RegisterNumber === mark.RegisterNumber) || {};
        return {
          RegisterNumber: mark.RegisterNumber,
        StudentName: student.StudentName || "Unknown",
        Obtained: mark.Obtained,
        Results: mark.Results,
        };
      });
      res.json(result);


  } catch (error) {
      console.error("Error fetching student marks:", error);
      res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/year-coordinator/marks/:subject/:section/:cae", async (req, res) => {
  try {
      const { subject, section, cae } = req.params;
      console.log("Fetching marks for:", subject, section, "CAE:", cae);

      const students = await StudentMarks.find({ SubjectCode: subject, Section: section, CAE: cae });

      if (students.length === 0) {
          return res.status(404).json({ message: "No students found for this subject and section." });
      }

      res.json(students);
  } catch (error) {
      console.error("Error fetching marks:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
