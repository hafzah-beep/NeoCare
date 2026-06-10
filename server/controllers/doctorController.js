const Doctor = require("../models/Doctor");
const User = require("../models/User");

// =======================
// APPLY DOCTOR
// =======================
const applyDoctorController = async (req, res) => {
  try {
    const existingDoctor = await Doctor.findOne({
      userId: req.userId,
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah pernah mengajukan sebagai dokter",
      });
    }

    const doctor = new Doctor({
      ...req.body,
      userId: req.userId,
    });

    await doctor.save();

    await User.updateMany(
  { role: "admin" },
  {
    $push: {
      notifications: `Pengajuan dokter baru dari ${doctor.fullName}`,
    },
     $inc: {
      unreadNotifications: 1,
    },
  }
);

    res.status(201).json({
      success: true,
      message: "Pengajuan dokter berhasil",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengajukan dokter",
      error: error.message,
    });
  }
};

// =======================
// GET APPROVED DOCTORS
// =======================
const getDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      status: "approved",
    });

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data dokter",
      error: error.message,
    });
  }
};

// =======================
// GET DOCTOR PROFILE
// =======================
const getDoctorProfileController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.userId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Profil dokter tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil profil dokter",
      error: error.message,
    });
  }
};

// =======================
// UPDATE DOCTOR PROFILE
// =======================
const updateDoctorProfileController = async (req, res) => {
  try {
    const {
      fullName,
      specialization,
      experience,
      fees,
      address,
      schedule,
    } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      {
        userId: req.userId,
      },
      {
        fullName,
        specialization,
        experience,
        fees,
        address,
        schedule,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Profil dokter tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profil dokter berhasil diperbarui",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui profil dokter",
      error: error.message,
    });
  }
};

module.exports = {
  applyDoctorController,
  getDoctorsController,
  getDoctorProfileController,
  updateDoctorProfileController,
};