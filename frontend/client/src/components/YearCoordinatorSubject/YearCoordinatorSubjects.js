import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function YearCoordinatorSubjects() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  
  useEffect(() => {
    const fetchSubjects = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("No token found. Please log in again.");
            return;
          }
      
          const response = await fetch("http://localhost:5000/api/year-coordinator/subjects", {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          const data = await response.json();
          console.log("Subjects:", data);
      
          if (response.ok) {
            setSubjects(data);
          } else {
            alert(data.message || "Failed to fetch subjects");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          alert("Error fetching subjects. Check console.");
        }
      };
      

    fetchSubjects();
  }, []);

  const handleSubjectClick = (subject) => {
    navigate(`/year-coordinator/marks/${subject._id}/${subject.Section}`);
  };

  return (
    <div>
      <h2>Subjects</h2>
      {subjects.length > 0 ? (
        <ul>
          {subjects.map((subject) => (
            <li key={subject._id} style={{ marginBottom: "10px"}}>
              <span>{subject.SubjectName} ({subject._id})</span><br />
              <span>Faculty: {subject.Faculty}</span><br />
              <button 
                onClick={() => handleSubjectClick(subject)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "5px"
                }}
              >
                {subject.Section}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No subjects available.</p>
      )}
    </div>
  );
  
}

export default YearCoordinatorSubjects;
