const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Akses hanya untuk admin",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada admin middleware",
      error: error.message,
    });
  }
};

module.exports = adminMiddleware;