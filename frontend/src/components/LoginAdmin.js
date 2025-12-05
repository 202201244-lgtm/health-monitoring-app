import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    //   const res = await api.post("/auth/login", form);
      const res = await api.post("/auth/login", {
        ...form,
        expectedRole: "ROLE_ADMIN",
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "ADMIN");
      navigate("/admin-dashboard");
    } catch {
      setMsg("❌ Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default LoginAdmin;
