import api from "../../api/api"; // Import centralized api
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", specialization: "" });
  const [viewMode, setViewMode] = useState(""); // "doctors" | "patients" | ""

  // 🔹 Create Doctor
  const createDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/create-doctor", form);
      alert("Doctor created successfully");
      setForm({ name: "", email: "", password: "", specialization: "" });
    } catch (err) {
      alert("Error creating doctor");
    }
  };

  // 🔹 Create Patient
  const createPatient = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/create-patient", form);
      alert("Patient created successfully");
      setForm({ name: "", email: "", password: "", specialization: "" });
    } catch (err) {
      alert("Error creating patient");
    }
  };

  // 🔹 Fetch doctors/patients
  const fetchData = async (type) => {
    const url =
      type === "doctors"
        ? "/admin/doctors"
        : "/admin/patients";
    const res = await api.get(url);
    if (type === "doctors") setDoctors(res.data);
    else setPatients(res.data);
    setViewMode(type);
  };

  // 🔹 Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/delete/${userId}`);
      alert("User deleted");
      fetchData(viewMode);
    } catch (err) {
      alert("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* 🔹 Buttons Section */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode("createDoctor")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Doctor
        </button>
        <button
          onClick={() => setViewMode("createPatient")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create Patient
        </button>
        <button
          onClick={() => fetchData("doctors")}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          View Doctors
        </button>
        <button
          onClick={() => fetchData("patients")}
          className="px-4 py-2 bg-orange-600 text-white rounded"
        >
          View Patients
        </button>
      </div>

      {/* 🔹 Create Doctor/Patient Form */}
      {(viewMode === "createDoctor" || viewMode === "createPatient") && (
        <form
          onSubmit={viewMode === "createDoctor" ? createDoctor : createPatient}
          className="bg-white p-6 rounded shadow-md max-w-md"
        >
          <h2 className="text-lg font-semibold mb-4">
            {viewMode === "createDoctor" ? "Create Doctor" : "Create Patient"}
          </h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full mb-3 p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {viewMode === "createDoctor" && (
            <input
              type="text"
              placeholder="Specialization"
              className="w-full mb-3 p-2 border rounded"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              required
            />
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Submit
          </button>
        </form>
      )}

      {/* 🔹 Doctors / Patients List */}
      {viewMode === "doctors" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">All Doctors</h2>
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Specialization</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td className="p-2 border">{d.name}</td>
                  <td className="p-2 border">{d.email}</td>
                  <td className="p-2 border">{d.specialization}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => deleteUser(d.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "patients" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">All Patients</h2>
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.email}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => deleteUser(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
