// frontend/src/components/dashboards/DoctorDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await api.get("/doctor/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error fetching patients");
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, []);

  const handleAddPatient = async () => {
    try {
      const res = await api.post("/doctor/add-patient", { patientId });
      setMessage(res.data.message || "Patient added");
      setPatientId("");
      fetchPatients();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error adding patient");
    }
  };

  const handleRemovePatient = async (id) => {
    try {
      const res = await api.delete(`/doctor/remove-patient/${id}`);
      setMessage(res.data.message || "Patient removed");
      fetchPatients();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error removing patient");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Doctor Dashboard</h1>

      <section style={{ margin: "20px 0", maxWidth: 640 }}>
        <h3>Add Patient Under Me</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={handleAddPatient} style={{ padding: "8px 12px" }}>
            Add
          </button>
        </div>
        {message && <p style={{ color: "#333", marginTop: 8 }}>{message}</p>}
      </section>

      <section style={{ marginTop: 24, maxWidth: 800 }}>
        <h3>My Patients</h3>
        {patients.length === 0 ? (
          <p>No patients assigned yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {patients.map((p) => (
              <li
                key={p.id ?? p._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{ cursor: "pointer", color: "#0B5FFF" }}
                  onClick={() => navigate(`/patient/${p.id ?? p._id}`)}
                >
                  {p.name} ({p.email})
                </div>
                <div>
                  <button
                    onClick={() => handleRemovePatient(p.id ?? p._id)}
                    style={{ color: "white", background: "#E53935", padding: "6px 10px", border: "none", borderRadius: 4 }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
