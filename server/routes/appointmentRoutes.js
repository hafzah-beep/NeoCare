const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const doctorMiddleware = require("../middleware/doctorMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

const upload = require("../config/multer");

const {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
} = require("../controllers/appointmentController");

// =========================
// USER BOOK APPOINTMENT
// =========================

router.post(
  "/book",
  authMiddleware,
  userMiddleware,
  upload.single("document"),
  bookAppointment
);

// =========================
// USER LIHAT RIWAYAT APPOINTMENT
// =========================

router.get(
  "/user",
  authMiddleware,
  getUserAppointments
);

// =========================
// DOKTER LIHAT APPOINTMENT MASUK
// =========================

router.get(
  "/doctor",
  authMiddleware,
  doctorMiddleware,
  getDoctorAppointments
);

// =========================
// DOKTER APPROVE APPOINTMENT
// =========================

router.post(
  "/approve",
  authMiddleware,
  doctorMiddleware,
  approveAppointment
);

// =========================
// DOKTER REJECT APPOINTMENT
// =========================

router.post(
  "/reject",
  authMiddleware,
  doctorMiddleware,
  rejectAppointment
);

module.exports = router;