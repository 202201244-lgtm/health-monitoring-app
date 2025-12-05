import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Health Monitoring System</h1>
      <div className="btn-group">
        {/* <button onClick={() => navigate("/register")}>Register</button> */}
        <button onClick={() => navigate("/login-role")}>Login</button>
      </div>
    </div>
  );
};

export default Home;
