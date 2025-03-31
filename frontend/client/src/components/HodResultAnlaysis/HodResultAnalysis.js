import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function HodResultAnalysis() {
    const { subject, section } = useParams();
    const [students, setStudents] = useState([]);
    const [studentData, setStudentData] = useState(null);
    const [passPercentage, setPassPercentage] = useState(0);
    const [failPercentage, setFailPercentage] = useState(0);
    const [selectedCae, setSelectedCae] = useState("1"); 
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!selectedCae) return;

        fetch(`http://localhost:5000/api/student-marks/${encodeURIComponent(subject)}/${section}/${selectedCae}`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const formattedData = data.map((student) => ({
                        id: student._id,
                        registerNumber: student.RegisterNumber,
                        name: student.StudentName,
                        obtained: student.Obtained || student.marks || "N/A",
                        result: student.Results ? student.Results : "N/A"
                    }));

                    formattedData.sort((a, b) => parseInt(a.registerNumber) - parseInt(b.registerNumber));
                    setStudents(formattedData);

                    const totalStudents = formattedData.length;
                    if (totalStudents > 0) {
                        const passCount = formattedData.filter(student => student.result.toLowerCase() === "pass").length;
                        const passPercentage = ((passCount / totalStudents) * 100).toFixed(2);
                        const failPercentage = (100 - passPercentage).toFixed(2);

                        setPassPercentage(passPercentage);
                        setFailPercentage(failPercentage);
                    } else {
                        setPassPercentage(0);
                        setFailPercentage(0);
                    }
                } else {
                    setStudents([]);
                    setPassPercentage(0);
                    setFailPercentage(0);
                }
            })
            .catch((error) => console.error("Error fetching student marks:", error));
    }, [subject, section, selectedCae]);

    // Function to add a student
    const handleAddStudent = () => {
        const newStudent = {
            registerNumber: prompt("Enter Register Number:"),
            name: prompt("Enter Student Name:"),
            obtained: prompt("Enter Marks:"),
            result: prompt("Enter Result (Pass/Fail):"),
        };

        fetch("http://localhost:5000/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStudent),
        })
            .then((res) => res.json())
            .then((data) => {
                alert("Student Added: " + data.name);
                setStudents([...students, data]);
            })
            .catch((error) => console.error("Error adding student:", error));
    };

    // Function to delete a student
    const handleDeleteStudent = (id) => {
        fetch(`http://localhost:5000/api/students/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                alert("Student Deleted");
                setStudents(students.filter(student => student.id !== id));
            })
            .catch((error) => console.error("Error deleting student:", error));
    };

    // Function to update a student
    const handleUpdateStudent = (id) => {
        const updatedMarks = prompt("Enter new marks:");
        fetch(`http://localhost:5000/api/students/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ obtained: updatedMarks }),
        })
            .then(() => {
                alert("Student Updated");
                setStudents(students.map(student =>
                    student.id === id ? { ...student, obtained: updatedMarks } : student
                ));
            })
            .catch((error) => console.error("Error updating student:", error));
    };

    // Function to search students
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            alert("Please enter a search query");
            return;
        }
    
        fetch(`http://localhost:5000/api/students?query=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();  // Ensure JSON parsing
        })
        .then((data) => {
            console.log("Student Data:", data);  // Debugging
            if (data.length > 0) {
                setStudentData(data[0]);  // Update state
            } else {
                setStudentData(null);  // Handle no results
            }
        })
        .catch((error) => console.error("Error searching students:", error));
    };
    

    const pieData = [
        { name: "Pass", value: parseFloat(passPercentage) },
        { name: "Fail", value: parseFloat(failPercentage) }
    ];

    const COLORS = ["#28a745", "#660033"]; 

    return (
        <div className="result-analysis">
            <h2>Result Analysis for {subject} - {section}</h2>
            
            {/* Buttons for CRUD operations */}
            <div className="button-container">
                <button onClick={handleAddStudent} 
                    style={{backgroundColor: '#660033', padding: '8px 8px', border: 'none', color: 'white'}}
                className="add-btn">Add Student</button>
                <button onClick={() => {
                    const id = prompt("Enter Student ID to Delete:");
                    if (id) handleDeleteStudent(id);
                }} 
                style={{backgroundColor: '#660033', padding: '8px 8px', border: 'none', color: 'white'}}
                className="delete-btn">Delete Student</button>
                <button onClick={() => {
                    const id = prompt("Enter Student ID to Update:");
                    if (id) handleUpdateStudent(id);
                }} 
                style={{backgroundColor: '#660033', padding: '8px 8px', border: 'none', color: 'white'}}
                className="update-btn">Update Student</button>
               {/* <input 
                    type="text" 
                    placeholder="Search by Name or Register Number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px'}}
                />
               {/*<button onClick={handleSearch} 
                 style={{backgroundColor: '#660033', padding: '8px 8px', border: 'none', color: 'white'}}
                className="search-btn">Search</button>*/}
            </div> 

            {/* Student Table */}
            <div className="content-container">
                <div className="table-container">
                    {students.length > 0 ? (
                        <table border="1">
                            <thead>
                                <tr>
                                    
                                    <th>Name</th>
                                    <th>Register Number</th>
                                    <th>Marks</th>
                                    <th>Result</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        
                                        <td>{student.name}</td>
                                        <td>{student.registerNumber}</td>
                                        <td>{student.obtained}</td>
                                        <td className={student.result?.toLowerCase() === "pass" ? "pass" : "fail"}>
                                            {student.result || "N/A"}
                                        </td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No students found.</p>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="chart-container">
                    <h3>Pass-Fail Percentage</h3>
                    <PieChart width={500} height={500}>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
}

export default HodResultAnalysis;
