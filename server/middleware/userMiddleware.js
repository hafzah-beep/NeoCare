const User = require("../models/User");

const userMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Hanya user/pasien yang dapat melakukan booking",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada user middleware",
      error: error.message,
    });
  }
};

module.exports = userMiddleware;