import React, { useState } from "react";
import api from "../api/api";

const CreatePatient = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      setMsg(`✅ ${res.data.message}`);
    } catch (err) {
      setMsg("❌ Error creating patient");
    }
  };

  return (
    <div className="container">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <button type="submit">Create</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default CreatePatient;
