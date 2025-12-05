export default function ProfileView({ patient }) {
  return (
    <div>
      <h2>Patient Profile</h2>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Email:</strong> {patient.email}</p>
      <p><strong>Phone:</strong> {patient.phone}</p>
      <p><strong>Assigned Doctor:</strong> {patient.assignedDoctorId ?? "None"}</p>
    </div>
  );
}
