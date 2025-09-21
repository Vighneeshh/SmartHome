const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware to handle cross-origin requests and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for the device state and sensor readings
let deviceState = {
  fan: 0,       // PWM value (0-255)
  light: 0,     // PWM value (0-255)
  sensors: {
    gas: 0,     // Raw value from gas sensor
    ldr: 0,     // Raw value from LDR
    temp: 0     // Value from temperature sensor in °C
  }
};

// ======================================
// API Endpoint for the Frontend to control devices
// ======================================
// This route accepts POST requests to update the fan and light values.
// The frontend (React app) will call this when a slider is moved.
app.post("/api/control", (req, res) => {
  const { fan, light } = req.body;
  
  if (fan !== undefined) {
    deviceState.fan = Math.max(0, Math.min(255, parseInt(fan)));
  }
  if (light !== undefined) {
    deviceState.light = Math.max(0, Math.min(255, parseInt(light)));
  }

  console.log("Updated device state:", deviceState);
  res.json({ success: true, state: deviceState });
});

// ======================================
// API Endpoint for the ESP32 to send sensor data
// ======================================
// This route accepts POST requests from the ESP32 with sensor readings.
// The ESP32 will periodically send data to this endpoint.
app.post("/api/sensors", (req, res) => {
  const { gas, ldr, temp } = req.body;
  
  if (gas !== undefined) {
    deviceState.sensors.gas = parseFloat(gas);
  }
  if (ldr !== undefined) {
    deviceState.sensors.ldr = parseFloat(ldr);
  }
  if (temp !== undefined) {
    deviceState.sensors.temp = parseFloat(temp);
  }

  console.log("Received sensor data:", deviceState.sensors);
  res.json({ success: true });
});

// ======================================
// API Endpoint for the Frontend to get the latest state
// ======================================
// This route is a simple GET request that returns the current state
// of all devices and sensors. The frontend will poll this endpoint.
app.get("/api/state", (req, res) => {
  res.json(deviceState);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});