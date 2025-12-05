import React, { useState } from "react";
import api from "../api/api";

const RegisterPatient = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { ...form, role: "PATIENT" });
      setMsg("✅ Registered successfully!");
    } catch (err) {
      setMsg("❌ Error registering user");
    }
  };

  return (
    <div className="container">
      <h2>Register as Patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default RegisterPatient;
