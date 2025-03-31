import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Result.css";

function Result() {
  const { registerNumber } = useParams();
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [selectedCae, setSelectedCae] = useState(1);
  const resultRef = useRef(null);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/marks/${Number(registerNumber)}`);
        const data = await response.json();

        if (response.ok) {
          setMarks(data);
          setFilteredMarks(data.filter(mark => mark.CAE === 1)); // Default to CAE 1
        } else {
          console.error("Failed to fetch marks:", data.message);
        }
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    fetchMarks();
  }, [registerNumber]);

  const handleCaeChange = (cae) => {
    setSelectedCae(cae);
    setFilteredMarks(marks.filter(mark => mark.CAE === cae));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="result-container">
      <h2>Results for {registerNumber}</h2>
      
      <div className="cae-buttons">
        <button onClick={() => handleCaeChange(1)} className={selectedCae === 1 ? "active" : ""}>CAE 1</button>
        <button onClick={() => handleCaeChange(2)} className={selectedCae === 2 ? "active" : ""}>CAE 2</button>
      </div>

      <div ref={resultRef}>
        {filteredMarks.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>SNo</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Cae</th>
                <th>Max Marks</th>
                <th>Obtained Marks</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarks.map((mark, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{mark.SubjectCode}</td>
                  <td>{mark.SubjectName}</td>
                  <td>{mark.CAE}</td>
                  <td>{mark.Max}</td>
                  <td>{mark.Obtained}</td>
                  <td className={mark.Results.toLowerCase() === "pass" ? "pass" : "fail"}>
                    {mark.Results}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No marks found</p>
        )}
      </div>

      <button className="print-button" onClick={handlePrint}>🖨️ Print</button>
    </div>
  );
}

export default Result;
