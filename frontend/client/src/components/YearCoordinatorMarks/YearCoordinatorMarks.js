import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import UploadExcel from "../Upload/UploadExcel";

function YearCoordinatorMarks() {
    const { subject, section } = useParams();
    const [students, setStudents] = useState([]);
    const [passPercentage, setPassPercentage] = useState(0); // Updated state
    const [failPercentage, setFailPercentage] = useState(0); // Updated state
    const [selectedCae, setSelectedCae] = useState("1");

    const fetchStudentData = () => {
        if (!selectedCae) return;

        fetch(`http://localhost:5000/api/year-coordinator/marks/${encodeURIComponent(subject)}/${encodeURIComponent(section)}/${selectedCae}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                if (Array.isArray(data)) {
                    const formattedData = data.map((student) => ({
                        registerNumber: student.RegisterNumber,
                        name: student.StudentName,
                        obtained: student.Obtained || student.marks,
                        result: student.Results
                    }));

                    formattedData.sort((a, b) => a.registerNumber - b.registerNumber);
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
                    console.error("API returned non-array data:", data);
                    setStudents([]);
                    setPassPercentage(0);
                    setFailPercentage(0);
                }
            })
            .catch((error) => console.error("Error fetching student marks:", error));
    };

    useEffect(() => {
        fetchStudentData();
    }, [subject, section, selectedCae]);

    const handleDataUpload = async (data) => {
        setStudents(data);

        try {
            const response = await fetch("http://localhost:5000/api/upload-marks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Marks uploaded successfully!");
                fetchStudentData();
            } else {
                alert("Failed to upload marks.");
            }
        } catch (error) {
            console.error("Error uploading marks:", error);
        }
    };


    // Pie chart data
    const pieData = [
        { name: "Pass", value: parseFloat(passPercentage) },
        { name: "Fail", value: parseFloat(failPercentage) }
    ];

    const COLORS = ["#28a745", "#660033"]; // Green for Pass, Red for Fail

    return (
        <div className="result-analysis">
            <h2>Result Analysis for {subject} - {section}</h2>


            {/* CAE Selection */}
            <label>Select CAE:</label>
            <select value={selectedCae} onChange={(e) => setSelectedCae(e.target.value)}>
                <option value="1">CAE 1</option>
                <option value="2">CAE 2</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <UploadExcel onDataUpload={handleDataUpload} />
</div>



            {/* Student Table */}
            <div className="content-container">
                <div className="table-container">
                    {students.length > 0 ? (
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Register Number</th>
                                    <th>Name</th>
                                    <th>Marks</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.registerNumber}</td>
                                        <td>{student.name}</td>
                                        <td>{student.obtained}</td>
                                        <td className={student.result.toLowerCase() === "pass" ? "pass" : "fail"}>
                                            {student.result}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No students found for this section.</p>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="chart-container">
                    <h3>Pass-Fail Percentage</h3>
                    <div className="result-count">
                        <p className="pass-count">Pass Percentage: {passPercentage}%</p>
                        <p className="fail-count">Fail Percentage: {failPercentage}%</p>                  
                        </div>
                        <PieChart width={500} height={500}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
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

export default YearCoordinatorMarks;
