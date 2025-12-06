// frontend/src/components/patient/Telemetry.js
import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import mqtt from "mqtt";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// MQTT Broker Config
const MQTT_BROKER = "wss://eeeaf4837dbe4d58909102526709abf6.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_Username = 'mitulsudani188';
const MQTT_Password = 'Mitulsudani188';
// Default ID matching the dummy publisher
const DEFAULT_PATIENT_ID = "693444c5fd18e33e4f7ef85c";

export default function Telemetry({ patientId }) {
  const activePatientId = patientId || DEFAULT_PATIENT_ID;

  // MQTT Topics
  const HEART_TOPIC = `patient/${activePatientId}/heartRate`;
  const SPO2_TOPIC = `patient/${activePatientId}/spo2`;
  const TEMP_TOPIC = `patient/${activePatientId}/temperature`;
  const ECG_TOPIC = `patient/${activePatientId}/ecg`;

  const [heartData, setHeartData] = useState([]);
  const [spo2Data, setSpo2Data] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [ecgData, setEcgData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER, {
      username: MQTT_Username,
      password: MQTT_Password,
    });
    clientRef.current = client;

    client.on("connect", () => {
      console.log("MQTT Connected");
      client.subscribe([HEART_TOPIC, SPO2_TOPIC, TEMP_TOPIC, ECG_TOPIC], (err) => {
        if (err) console.error("Subscription error:", err);
        else console.log(`Subscribed to topics for patient: ${activePatientId}`);
      });
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const { timestamp, data } = payload;

        const startTime = new Date(timestamp).getTime();
        const interval = 1000; // assuming 1 second between samples for HR, SpO2, Temp

        // ECG might have smaller interval, we will just reuse same for simplicity
        const newTimestamps = data.map((_, i) =>
          new Date(startTime + i * interval).toLocaleTimeString()
        );

        setTimestamps((prev) => [...prev, ...newTimestamps].slice(-100));

        if (topic === HEART_TOPIC) {
          setHeartData((prev) => [...prev, ...data].slice(-100));
        } else if (topic === SPO2_TOPIC) {
          setSpo2Data((prev) => [...prev, ...data].slice(-100));
        } else if (topic === TEMP_TOPIC) {
          setTempData((prev) => [...prev, ...data].slice(-100));
        } else if (topic === ECG_TOPIC) {
          setEcgData((prev) => [...prev, ...data].slice(-500)); // ECG can have more points
        }
      } catch (err) {
        console.error("Error parsing MQTT:", err);
      }
    });

    return () => clientRef.current?.end();
  }, []);

  // Heart Rate Chart
  const heartChart = {
    labels: timestamps,
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: heartData,
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.3)",
      },
    ],
  };

  // SpO2 Chart
  const spo2Chart = {
    labels: timestamps,
    datasets: [
      {
        label: "SpO₂ (%)",
        data: spo2Data,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.3)",
      },
    ],
  };

  // Temperature Chart
  const tempChart = {
    labels: timestamps.slice(-tempData.length),
    datasets: [
      {
        label: "Temperature (°F)",
        data: tempData,
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.3)",
      },
    ],
  };

  // ECG Chart
  const ecgChart = {
    labels: ecgData.map((_, i) => i), // simple index for ECG points
    datasets: [
      {
        label: "ECG",
        data: ecgData,
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.3)",
      },
    ],
  };

  return (
    <div style={{ width: "90%", margin: "auto", padding: 24 }}>
      <h2>Patient Telemetry</h2>

      <h3>Heart Rate</h3>
      <Line
        data={heartChart}
        options={{ responsive: true, scales: { y: { min: 50, max: 140 } } }}
      />

      <h3 style={{ marginTop: 40 }}>SpO₂</h3>
      <Line
        data={spo2Chart}
        options={{ responsive: true, scales: { y: { min: 80, max: 100 } } }}
      />

      <h3 style={{ marginTop: 40 }}>Temperature</h3>
      <Line
        data={tempChart}
        options={{ responsive: true, scales: { y: { min: 96, max: 100 } } }}
      />

      <h3 style={{ marginTop: 40 }}>ECG</h3>
      <Line
        data={ecgChart}
        options={{ responsive: true, scales: { y: { min: 450, max: 600 } } }} // ECG amplitude range
      />
    </div>
  );
}
