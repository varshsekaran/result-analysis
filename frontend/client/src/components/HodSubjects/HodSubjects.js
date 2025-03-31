import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HodSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [selectedCBCS, setSelectedCBCS] = useState(false); // Toggle CBCS subjects
  const navigate = useNavigate();

  // Define CBCS subjects manually
  const CBCS_SUBJECTS = [
    "SCSA3091 - Society 5.0",
    "SEEA3027 - Green Energy Systems",
    "SECA1703 - Internet of Things",
    "SCSA3001 - Data Mining and Data Warehousing",
    "SAEA4002 - Fundamentals of Aerospace Technology",
    "SCHA4002 - Energy engineering",
    "SCSB4011 - Cyber security Essentials for Engineers",
    "SMEA3012 - Industrial Robotics and Expert Systems",
    "SBTA4001 - Biology for Engineers",
    "SCIA4001 - Disaster Management",
    "SMEA3017 - Industrial Safety Engineering",	
    "SMEA4002 - Wind and Solar Energy",	
    "SCHA3010 - Industrial Safety and Hazard Analysis",
    "SBAB4002 -  National Entrepreneurship Network"
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/hod/subjects")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched subjects:", data);
        setSubjects(data || []);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      });
  }, []);

  // Navigate to HodResultAnalysis page with subject & section
  const handleSectionClick = (subject, section) => {
    navigate(`/hod-result-analysis/${encodeURIComponent(subject)}/${encodeURIComponent(section)}`);
  };

  // Toggle CBCS view
  const handleCBCSClick = () => {
    setSelectedCBCS(!selectedCBCS);
  };

  // Separate CBCS and Core subjects
  const cbcsSubjects = subjects.filter((subject) =>
    subject.subject && CBCS_SUBJECTS.some((cbcs) => (subject.subject || "").toLowerCase().includes(cbcs.split(" - ")[1].toLowerCase()))
  );
  const coreSubjects = subjects.filter((subject) =>
    subject.subject && !CBCS_SUBJECTS.some((cbcs) => (subject.subject || "").toLowerCase().includes(cbcs.split(" - ")[1].toLowerCase()))
  );
  

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#831238" }}>HOD SUBJECTS</h2>

      {/* CBCS Toggle Button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={handleCBCSClick}
          style={{
            backgroundColor: selectedCBCS ? "#555" : "#831238",
            color: "white",
            padding: "10px 15px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          {selectedCBCS ? "Show Core Subjects" : "Show CBCS Subjects"}
        </button>
      </div>

      {/* Conditional Rendering based on selectedCBCS */}
      {selectedCBCS ? (
        <>
          <h3 style={{ textAlign: "center", color: "#831238" }}>CBCS Subjects</h3>
          {cbcsSubjects.length === 0 ? (
            <p style={{ textAlign: "center" }}>No CBCS subjects available...</p>
          ) : (
            cbcsSubjects.map((subject, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  borderRadius: "5px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Subject Title */}
                <h3 style={{ color: "#831238", borderBottom: "2px solid white", paddingBottom: "5px" }}>
                  {subject.subject}
                </h3>

                {/* Section Buttons */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  {Array.from(new Set(subject.sections.map((s) => s.trim().toUpperCase())))
                    .sort()
                    .map((section, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSectionClick(subject.subject, section)}
                        style={{
                          backgroundColor: "#831238",
                          color: "white",
                          padding: "10px 15px",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "5px",
                          fontSize: "14px",
                          minWidth: "50px",
                          textAlign: "center",
                        }}
                      >
                        {section}
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <>
          <h3 style={{ textAlign: "center", color: "#831238" }}>Core Subjects</h3>
          {coreSubjects.length === 0 ? (
            <p style={{ textAlign: "center" }}>No core subjects available...</p>
          ) : (
            coreSubjects.map((subject, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  borderRadius: "5px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Subject Title */}
                <h3 style={{ color: "#831238", borderBottom: "2px solid white", paddingBottom: "5px" }}>
                  {subject.subject}
                </h3>

                {/* Section Buttons */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  {Array.from(new Set(subject.sections.map((s) => s.trim().toUpperCase())))
                    .sort()
                    .map((section, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSectionClick(subject.subject, section)}
                        style={{
                          backgroundColor: "#831238",
                          color: "white",
                          padding: "10px 15px",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "5px",
                          fontSize: "14px",
                          minWidth: "50px",
                          textAlign: "center",
                        }}
                      >
                        {section}
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default HodSubjects;
