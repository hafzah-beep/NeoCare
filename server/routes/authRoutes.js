const express = require("express");

const router = express.Router();

const {
  registerController,
  loginController,
  getUserController,
  markNotificationsAsRead,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/register",
  registerController
);

router.post(
  "/login",
  loginController
);

router.get(
  "/me",
  authMiddleware,
  getUserController
);

router.put(
  "/notifications/read",
  authMiddleware,
  markNotificationsAsRead
);

module.exports = router;