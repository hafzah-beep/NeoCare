const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =======================
// REGISTER
// =======================

const registerController = async (req, res) => {
  try {

    console.log("=== REGISTER REQUEST ===");
    console.log(req.body);

    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // cek email

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    // hash password

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    console.log(
      "=== SEBELUM SAVE USER ==="
    );

    await user.save();

    console.log(
      "=== USER BERHASIL DISIMPAN ==="
    );

    res.status(201).json({
      success: true,
      message: "Register berhasil",
    });

  } catch (error) {

    console.log(
      "=== REGISTER ERROR ==="
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};


// =======================
// LOGIN
// =======================

const loginController = async (req, res) => {
  try {

    console.log("=== LOGIN REQUEST ===");
    console.log(req.body);

    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Akun Anda sedang dinonaktifkan oleh admin",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "=== LOGIN BERHASIL ==="
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.log(
      "=== LOGIN ERROR ==="
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};


// =======================
// GET USER LOGIN
// =======================

const getUserController = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.userId
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(
      "=== GET USER ERROR ==="
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        unreadNotifications: 0,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notifikasi sudah dibaca",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui notifikasi",
      error: error.message,
    });
  }
};

// =======================
// EXPORT
// =======================

module.exports = {
  registerController,
  loginController,
  getUserController,
  markNotificationsAsRead,
};