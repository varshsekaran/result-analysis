import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [userType, setUserType] = useState("student");
  const [registerNumber, setRegisterNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [section, setSection] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      let data;
      let endpoint = isRegistering ? "register" : "login";

      if (userType === "student") {
        response = await fetch("http://localhost:5000/api/students/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ RegisterNumber: registerNumber, Password: password }),
        });
      } else if (userType === "faculty") {
        response = await fetch(`http://localhost:5000/api/faculty/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegistering ? { name, email, password } : { email, password }
          ),
        });
      } else if (userType === "hod") {
        response = await fetch(`http://localhost:5000/api/hod/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegistering ? { name, email, password } : { email, password }
          ),
        });
      } else if (userType === "year-coordinator") {
        response = await fetch(`http://localhost:5000/api/year-coordinator/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegistering ? { name, email, password, section } : { email, password }
          ),
        });
      }

      data = await response.json();

      if (response.ok) {
        alert(isRegistering ? "Registration Successful! Please login." : "Login Successful!");
        localStorage.setItem("token", data.token);

        if (userType === "student") {
          navigate(`/result/${registerNumber}`);
        } else if (userType === "faculty") {
          navigate("/faculty-subjects");
        } else if (userType === "hod") {
          navigate("/hod-subjects"); // Redirect to HOD Subjects Page
        } else if (userType === "year-coordinator") {
          localStorage.setItem("yearCoordinatorSection", data.section);
          navigate("/yearcoordinatorsection");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-box">
        <h2>{isRegistering ? `${userType.toUpperCase()} Registration` : "Login"}</h2>

        <select onChange={(e) => setUserType(e.target.value)}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="hod">HOD</option>
          <option value="year-coordinator">Year Coordinator</option>
        </select>

        <form onSubmit={handleSubmit}>
          {userType === "student" ? (
            <input
              type="text"
              placeholder="Register Number"
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              required
            />
          ) : (
            <>
              {isRegistering && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {userType === "year-coordinator" && (
                    <input
                      type="text"
                      placeholder="Section"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      required
                    />
                  )}
                </>
              )}
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </form>

        {(userType === "year-coordinator" || userType === "hod") && (
          <p>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
