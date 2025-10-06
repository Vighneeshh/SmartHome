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

// Energy usage tracking
let energyData = {
  dailyUsage: [],
  hourlyUsage: Array(24).fill(0),
  totalSavings: 0,
  lastOptimizationTime: null,
  usageHistory: []
};

// Function to calculate energy consumption
const calculateEnergyConsumption = (lightValue, fanValue) => {
  // LED power consumption: ~10W at full brightness
  // Fan power consumption: ~15W at full speed
  const lightPower = (lightValue / 255) * 10; // Watts
  const fanPower = (fanValue / 255) * 15; // Watts
  return lightPower + fanPower;
};

// Function to track energy usage
const trackEnergyUsage = () => {
  const currentConsumption = calculateEnergyConsumption(deviceState.light, deviceState.fan);
  const hour = new Date().getHours();
  
  energyData.hourlyUsage[hour] += currentConsumption / 3600; // Convert to kWh per hour
  
  // Add to usage history with timestamp
  energyData.usageHistory.push({
    timestamp: new Date(),
    light: deviceState.light,
    fan: deviceState.fan,
    consumption: currentConsumption,
    temperature: deviceState.sensors.temp,
    lightLevel: deviceState.sensors.ldr
  });

  // Keep only last 1000 entries to prevent memory overflow
  if (energyData.usageHistory.length > 1000) {
    energyData.usageHistory = energyData.usageHistory.slice(-1000);
  }
};

// Start energy tracking interval
setInterval(trackEnergyUsage, 60000); // Track every minute

// ======================================
// API Endpoint for the Frontend to control devices
// ======================================
// This route accepts POST requests to update the fan and light values.
// The frontend (React app) will call this when a slider is moved.
app.get("/", (req, res) => {
  res.send("🎉 Hello! The API server is running correctly.");
});

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

// ======================================
// API Endpoint for Energy Optimization
// ======================================
app.get("/api/energy", (req, res) => {
  const currentConsumption = calculateEnergyConsumption(deviceState.light, deviceState.fan);
  const dailyTotal = energyData.hourlyUsage.reduce((sum, usage) => sum + usage, 0);
  
  res.json({
    currentConsumption: currentConsumption.toFixed(2),
    dailyUsage: dailyTotal.toFixed(3),
    hourlyUsage: energyData.hourlyUsage,
    totalSavings: energyData.totalSavings,
    usageHistory: energyData.usageHistory.slice(-24), // Last 24 entries
    lastUpdate: new Date()
  });
});

// API Endpoint to apply AI optimization
app.post("/api/optimize", (req, res) => {
  const { lightValue, fanValue, expectedSavings } = req.body;
  
  const beforeConsumption = calculateEnergyConsumption(deviceState.light, deviceState.fan);
  
  // Apply the optimization
  if (lightValue !== undefined) {
    deviceState.light = Math.max(0, Math.min(255, parseInt(lightValue)));
  }
  if (fanValue !== undefined) {
    deviceState.fan = Math.max(0, Math.min(255, parseInt(fanValue)));
  }
  
  const afterConsumption = calculateEnergyConsumption(deviceState.light, deviceState.fan);
  const actualSavings = beforeConsumption - afterConsumption;
  
  // Track savings
  if (actualSavings > 0) {
    energyData.totalSavings += actualSavings;
  }
  
  energyData.lastOptimizationTime = new Date();
  
  console.log(`AI Optimization applied: Light: ${lightValue}, Fan: ${fanValue}, Savings: ${actualSavings.toFixed(2)}W`);
  
  res.json({ 
    success: true, 
    state: deviceState,
    actualSavings: actualSavings.toFixed(2),
    expectedSavings: expectedSavings
  });
});

// API Endpoint for usage analytics
app.get("/api/analytics", (req, res) => {
  const now = new Date();
  const hour = now.getHours();
  
  // Calculate peak usage hours
  const peakHour = energyData.hourlyUsage.indexOf(Math.max(...energyData.hourlyUsage));
  const lowHour = energyData.hourlyUsage.indexOf(Math.min(...energyData.hourlyUsage.filter(h => h > 0)));
  
  // Calculate efficiency score based on usage patterns
  const totalUsage = energyData.hourlyUsage.reduce((sum, usage) => sum + usage, 0);
  const averageUsage = totalUsage / 24;
  const currentUsage = energyData.hourlyUsage[hour];
  const efficiencyScore = Math.max(0, Math.min(100, 100 - ((currentUsage / averageUsage - 1) * 50)));
  
  res.json({
    peakHour,
    lowHour,
    averageDaily: totalUsage.toFixed(3),
    currentHourUsage: currentUsage.toFixed(3),
    efficiencyScore: efficiencyScore.toFixed(1),
    totalSavings: energyData.totalSavings.toFixed(2),
    optimizationCount: energyData.usageHistory.filter(h => h.timestamp > new Date(Date.now() - 24*60*60*1000)).length
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});