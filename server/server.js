const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Load ENV
dotenv.config();

// Connect Database
connectDB();

// Init App
const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

//Doctor
const doctorRoutes =
require("./routes/doctorRoutes");

app.use(
  "/api/doctors",
  doctorRoutes
);

//Admin
const adminRoutes =
require("./routes/adminRoutes");

app.use(
"/api/admin",
adminRoutes
);

//Appointment
const appointmentRoutes =
require("./routes/appointmentRoutes");

app.use(
"/api/appointments",
appointmentRoutes
);

app.use(
"/uploads",
express.static("uploads")
);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Doctor Booking API Running",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route tidak ditemukan",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});