import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FacultySubject() {
    const [subjects, setSubjects] = useState([]); // Default empty array
    const [facultyName, setFacultyName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedFacultyName = localStorage.getItem("facultyName");

        if (storedFacultyName) {
            setFacultyName(storedFacultyName);

            fetch(`http://localhost:5000/api/faculty/faculty-subjects/${storedFacultyName}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("API Response:", data);

                    if (!data || (Array.isArray(data) && data.length === 0)) {
                        console.error("No subjects found.");
                        setSubjects([]);
                        return;
                    }

                    // Ensure data is an array
                    const formattedData = Array.isArray(data) ? data : [data];

                    // Properly format subjects with sections
                    const subjectsWithSections = formattedData.map(item => ({
                        SubjectName: item.SubjectName || "Unknown Subject",
                        sections: item.Section ? String(item.Section).split(",") : []
                    }));

                    setSubjects(subjectsWithSections);
                })
                .catch((error) => {
                    console.error("Error fetching subjects:", error);
                    setSubjects([]); // Prevents undefined issues
                });
        }
    }, []);

    const handleSectionClick = (subject, section) => {
        navigate(`/student-marks/${subject}/${section}`);
    };

    return (
        <div>
            <h2 style={{ color: "maroon", textAlign: "center" }}>FACULTY SUBJECTS</h2>

            {subjects.length > 0 ? (
                <ul>
                    {subjects.map((subject, index) => (
                        <li key={index}>
                            <strong>{subject.SubjectName}</strong> - Sections:
                            {subject.sections.length > 0 ? (
                                subject.sections.map((section, secIndex) => (
                                    <button
                                        key={secIndex}
                                        onClick={() => handleSectionClick(subject.SubjectName, section)}
                                        style={{ margin: "5px", padding: "5px", cursor: "pointer" }}
                                    >
                                        {section}
                                    </button>
                                ))
                            ) : (
                                <span> No Sections Available</span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading subjects or no subjects available...</p>
            )}
        </div>
    );
}

export default FacultySubject;
