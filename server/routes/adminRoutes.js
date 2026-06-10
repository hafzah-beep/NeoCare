const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllDoctors,
  getAllUsers,
  getUserDetail,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  approveDoctor,
  rejectDoctor,
  getDashboardStats,
  getAllAppointments,
  getAppointmentDetail,
  cancelAppointment,
} = require("../controllers/adminController");

// =========================
// DASHBOARD
// =========================
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// =========================
// DOCTORS
// =========================
router.get(
  "/doctors",
  authMiddleware,
  adminMiddleware,
  getAllDoctors
);

router.post(
  "/approve",
  authMiddleware,
  adminMiddleware,
  approveDoctor
);

router.post(
  "/reject",
  authMiddleware,
  adminMiddleware,
  rejectDoctor
);

// =========================
// USERS
// =========================
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  getUserDetail
);

router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);

router.put(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  updateUserStatus
);

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

// =========================
// APPOINTMENTS
// =========================
router.get(
  "/appointments",
  authMiddleware,
  adminMiddleware,
  getAllAppointments
);

router.get(
  "/appointments/:id",
  authMiddleware,
  adminMiddleware,
  getAppointmentDetail
);

router.put(
  "/appointments/:id/cancel",
  authMiddleware,
  adminMiddleware,
  cancelAppointment
);

module.exports = router;