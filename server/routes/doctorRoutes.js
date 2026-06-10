const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const doctorMiddleware = require("../middleware/doctorMiddleware");

const {
  applyDoctorController,
  getDoctorsController,
  getDoctorProfileController,
  updateDoctorProfileController,
} = require("../controllers/doctorController");

// =========================
// USER APPLY JADI DOKTER
// =========================
router.post(
  "/apply",
  authMiddleware,
  applyDoctorController
);

// =========================
// PUBLIC: LIHAT DOKTER APPROVED
// =========================
router.get(
  "/all",
  getDoctorsController
);

// =========================
// DOCTOR: LIHAT PROFIL SENDIRI
// =========================
router.get(
  "/profile",
  authMiddleware,
  doctorMiddleware,
  getDoctorProfileController
);

// =========================
// DOCTOR: UPDATE PROFIL SENDIRI
// =========================
router.put(
  "/profile",
  authMiddleware,
  doctorMiddleware,
  updateDoctorProfileController
);

module.exports = router;