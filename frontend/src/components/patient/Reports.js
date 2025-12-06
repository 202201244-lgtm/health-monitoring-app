import api from "../../api/api";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Reports = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [doctorComment, setDoctorComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchReports();
    }
  }, [patientId]);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/reports/${patientId}`);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Upload report
  const handleUpload = async () => {
    if (!file || !name) {
      alert("Please select file and enter report name");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("patientId", patientId);
      formData.append("doctorComment", doctorComment);

      // Use a fresh axios instance to avoid global interceptors attaching Auth headers
      const res = await axios.post("https://healthapp-backend-91mm.onrender.com/api/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setReports([res.data, ...reports]);
      setFile(null);
      setName("");
      setDoctorComment("");
      setShowUpload(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  // Delete report
  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await api.delete(`/reports/${reportId}`);
      setReports(reports.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete report");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Patient Reports</h2>

      {/* Upload Button */}
      <button
        onClick={() => setShowUpload(!showUpload)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        {showUpload ? "Cancel" : "Upload Report"}
      </button>

      {/* Upload Form */}
      {showUpload && (
        <div className="mb-6 p-4 border rounded shadow">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-2"
          />
          <input
            type="text"
            placeholder="Report Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2 block w-full border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Doctor Comment (optional)"
            value={doctorComment}
            onChange={(e) => setDoctorComment(e.target.value)}
            className="mb-2 block w-full border px-2 py-1 rounded"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-2">
        {reports.length === 0 && <p>No reports available.</p>}
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
          >
            <div>
              <strong>{report.name}</strong>{" "}
              <span className="text-sm text-gray-500">
                {new Date(report.uploadedAt).toLocaleString()}
              </span>
              {report.doctorComment && (
                <div className="text-sm text-gray-700">
                  Comment: {report.doctorComment}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(report.fileUrl, "_blank")}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
