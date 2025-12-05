// frontend/src/components/dashboards/PatientDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import ProfileView from "../patient/ProfileView";
import Telemetry from "../patient/Telemetry";
import Reports from "../patient/Reports";
import "./tabs.css";  // we'll add style next

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/doctor/patients");
        const found = res.data.find((p) => (p.id ?? p._id) === id);
        setPatient(found || null);
      } catch {
        setPatient(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!patient) return <p style={{ padding: 20 }}>Patient Not Found</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{patient.name} — Patient Dashboard</h1>

      {/* Tab Buttons */}
      <div className="tab-buttons">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={activeTab === "telemetry" ? "active" : ""}
          onClick={() => setActiveTab("telemetry")}
        >
          Telemetry
        </button>
        <button
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>



      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "profile" && <ProfileView patient={patient} />}
        {activeTab === "telemetry" && <Telemetry patientId={patient.id ?? patient._id} />}
        {activeTab === "reports" && patient?.id && (
    <Reports patientId={patient.id} />
)}

      </div>
    </div>
  );
}
