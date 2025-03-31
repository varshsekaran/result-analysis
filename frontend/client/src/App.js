import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login"; 
import Result from "./components/Result/Result";
import FacultySubject from "./components/FacultySubject/FacultySubject";
import ResultAnalysis from "./components/ResultAnalysis/ResultAnalysis";
import YearCoordinatorSubjects from "./components/YearCoordinatorSubject/YearCoordinatorSubjects";
import YearCoordinatorMarks from "./components/YearCoordinatorMarks/YearCoordinatorMarks";
import HodSubjects from "./components/HodSubjects/HodSubjects";
import HodResultAnalysis from "./components/HodResultAnlaysis/HodResultAnalysis";

import { useParams } from "react-router-dom";


function ResultWrapper() {
  const { registerNumber } = useParams();
  return <Result registerNumber={registerNumber} />;
}


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Result/:registerNumber" element={<ResultWrapper />} />
        <Route path="/faculty-subjects" element={<FacultySubject />} />
        <Route path="/student-marks/:subject/:section" element={<ResultAnalysis/>}/>
        <Route path="/yearcoordinatorsection" element={<YearCoordinatorSubjects />} />
        <Route path="/year-coordinator/marks/:subject/:section" element={<YearCoordinatorMarks />} />
        <Route path="/hod-subjects" element={<HodSubjects />} />
        <Route path="/hod-result-analysis/:subject/:section" element={<HodResultAnalysis />} />
      </Routes>
    </Router>
  );
}




export default App;
