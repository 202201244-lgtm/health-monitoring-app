import React, { useState } from "react";
import api from "../api/api";

function CreateDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await api.post("/admin/create-doctor", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Doctor created successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create doctor!");
    }
  };

  return (
    <div style={{ margin: "30px" }}>
      <h2>Admin: Create Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required /><br />
        <input name="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="phone" placeholder="Phone" onChange={handleChange} required /><br />
        <input name="specialization" placeholder="Specialization" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Create Doctor</button>
      </form>
    </div>
  );
}

export default CreateDoctor;
