const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("./models/Student");

dotenv.config(); // Load environment variables

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


fs.createReadStream("yearcoordinators.csv")
  .pipe(csvParser())
  .on("data", async (row) => {
    const { name, email, password, section } = row;

    const existingCoordinator = await YearCoordinator.findOne({ email });
    if (existingCoordinator) {
      console.log(`Year Coordinator with email ${email} already exists`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCoordinator = new YearCoordinator({ name, email, password: hashedPassword, section });

    await newCoordinator.save();
    console.log(`Added Year Coordinator: ${name}`);
  })
  .on("end", () => {
    console.log("CSV file processing completed");
    mongoose.connection.close();
  });

const addStudent = async () => {
    try {
        const hashedPassword = await bcrypt.hash("06-09-2004", 10);
        const newStudent = new Student({
            name: "Varsha S",
            registerNumber: "42111405",
            password: hashedPassword, // Store hashed password
        });

        await newStudent.save();
        console.log("✅ Student added successfully!");
    } catch (error) {
        console.error(" Error adding student:", error);
    } finally {
        mongoose.connection.close();
    }
};

addStudent();
