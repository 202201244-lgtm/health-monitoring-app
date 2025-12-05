import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterPatient from "./components/RegisterPatient";
import LoginRoleSelect from "./components/LoginRoleSelect";
import LoginPatient from "./components/LoginPatient";
import LoginDoctor from "./components/LoginDoctor";
import LoginAdmin from "./components/LoginAdmin";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import DoctorDashboard from "./components/dashboards/DoctorDashboard";
import PatientDetails from "./components/dashboards/PatientDetails";
import PatientDashboard from "./components/dashboards/PatientDashboard";
import CreateDoctor from "./components/CreateDoctor";
import CreatePatient from "./components/CreatePatient";
import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPatient />} />
        <Route path="/login-role" element={<LoginRoleSelect />} />
        <Route path="/login/patient" element={<LoginPatient />} />
        <Route path="/login/doctor" element={<LoginDoctor />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/create-doctor" element={<CreateDoctor />} />
        <Route path="/create-patient" element={<CreatePatient />} />
        <Route path="/test" element={<h1>TEST PAGE WORKING</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
