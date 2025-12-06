const mqtt = require('mqtt');

// HiveMQ Cloud Credentials
const MQTT_BROKER = "mqtts://eeeaf4837dbe4d58909102526709abf6.s1.eu.hivemq.cloud:8883";
const MQTT_USERNAME = "mitulsudani188";
const MQTT_PASSWORD = "Mitulsudani188";

const PATIENT_ID = "693444c5fd18e33e4f7ef85c";
const HEART_TOPIC = `patient/${PATIENT_ID}/heartRate`;
const SPO2_TOPIC = `patient/${PATIENT_ID}/spo2`;

const options = {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    rejectUnauthorized: true, // Needed for HiveMQ Cloud which uses public certs
};

console.log(`Connecting to ${MQTT_BROKER}...`);
const client = mqtt.connect(MQTT_BROKER, options);

client.on('connect', () => {
    console.log('✅ Connected to HiveMQ Cloud!');

    // Start publishing loop
    publishData();
    setInterval(publishData, 10000); // Every 10 seconds
});

client.on('error', (err) => {
    console.error('❌ Connection error:', err);
});

function publishData() {
    const batchSize = 10;
    const heartRateBuffer = [];
    const spo2Buffer = [];

    // Generate batch data
    for (let i = 0; i < batchSize; i++) {
        // Random HR between 70 and 90
        const hr = Math.floor(Math.random() * (90 - 70 + 1)) + 70;
        // Random SpO2 between 94 and 99
        const spo2 = Math.floor(Math.random() * (99 - 94 + 1)) + 94;

        heartRateBuffer.push(hr);
        spo2Buffer.push(spo2);
    }

    const timestamp = new Date().toISOString();

    // Prepare payloads
    const hrPayload = JSON.stringify({
        timestamp: timestamp,
        data: heartRateBuffer
    });

    const spo2Payload = JSON.stringify({
        timestamp: timestamp,
        data: spo2Buffer
    });

    // Publish
    client.publish(HEART_TOPIC, hrPayload, (err) => {
        if (err) console.error('Failed to publish HR:', err);
        else console.log(`📤 Published HR: ${hrPayload}`);
    });

    client.publish(SPO2_TOPIC, spo2Payload, (err) => {
        if (err) console.error('Failed to publish SpO2:', err);
        else console.log(`📤 Published SpO2: ${spo2Payload}`);
    });
}
