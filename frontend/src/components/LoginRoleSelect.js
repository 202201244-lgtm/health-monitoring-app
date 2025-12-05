import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Select Role</h2>
      <div className="btn-group">
        <button onClick={() => navigate("/login/patient")}>Patient</button>
        <button onClick={() => navigate("/login/doctor")}>Doctor</button>
        <button onClick={() => navigate("/login/admin")}>Admin</button>
      </div>
    </div>
  );
};

export default LoginRoleSelect;
