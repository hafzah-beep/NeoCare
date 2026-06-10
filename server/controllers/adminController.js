const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// =========================
// GET ALL DOCTORS
// =========================
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

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

// =========================
// GET ALL USERS
// =========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
};

// =========================
// GET USER DETAIL
// =========================
const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const doctorProfile = await Doctor.findOne({
      userId: user._id,
    });

    const appointmentCount = await Appointment.countDocuments({
      userId: user._id,
    });

    res.status(200).json({
      success: true,
      user,
      doctorProfile,
      appointmentCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail user",
      error: error.message,
    });
  }
};

// =========================
// UPDATE USER ROLE
// =========================
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    const allowedRoles = ["user", "doctor", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role tidak valid",
      });
    }

    if (id === req.userId) {
      return res.status(400).json({
        success: false,
        message: "Admin tidak dapat mengubah role akunnya sendiri",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role user berhasil diubah",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengubah role user",
      error: error.message,
    });
  }
};

// =========================
// UPDATE USER STATUS
// =========================
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(400).json({
        success: false,
        message: "Admin tidak dapat menonaktifkan akunnya sendiri",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: isActive
        ? "User berhasil diaktifkan"
        : "User berhasil dinonaktifkan",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengubah status user",
      error: error.message,
    });
  }
};

// =========================
// DELETE USER
// =========================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(400).json({
        success: false,
        message: "Admin tidak dapat menghapus akunnya sendiri",
      });
    }

    const appointmentCount = await Appointment.countDocuments({
      userId: id,
    });

    if (appointmentCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "User tidak dapat dihapus karena masih memiliki data appointment",
      });
    }

    await Doctor.deleteOne({
      userId: id,
    });

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus user",
      error: error.message,
    });
  }
};

// =========================
// APPROVE DOCTOR
// =========================
const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        status: "approved",
      },
      {
        new: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Data dokter tidak ditemukan",
      });
    }

    await User.findByIdAndUpdate(doctor.userId, {
      role: "doctor",
       $push: {
         notifications: "Pengajuan Anda sebagai dokter telah disetujui admin",
      },
      $inc: {
    unreadNotifications: 1,
  },
    });

    res.status(200).json({
      success: true,
      message: "Dokter berhasil disetujui",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal approve dokter",
      error: error.message,
    });
  }
};

// =========================
// REJECT DOCTOR
// =========================
const rejectDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        status: "rejected",
      },
      {
        new: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Data dokter tidak ditemukan",
      });
    }

    await User.findByIdAndUpdate(doctor.userId, {
      $push: {
        notifications: "Pengajuan Anda sebagai dokter ditolak admin",
      },
      $inc: {
    unreadNotifications: 1,
  },
    });

    res.status(200).json({
      success: true,
      message: "Dokter ditolak",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal reject dokter",
      error: error.message,
    });
  }
};

// =========================
// DASHBOARD STATS
// =========================
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalDoctors = await Doctor.countDocuments({
      status: "approved",
    });

    const pendingDoctors = await Doctor.countDocuments({
      status: "pending",
    });

    const totalAppointments = await Appointment.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        pendingDoctors,
        totalAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik",
      error: error.message,
    });
  }
};

// =========================
// GET ALL APPOINTMENTS
// =========================
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("userId")
      .populate("doctorId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil appointment",
      error: error.message,
    });
  }
};

// =========================
// GET APPOINTMENT DETAIL
// =========================
const getAppointmentDetail = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("userId")
      .populate("doctorId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail appointment",
      error: error.message,
    });
  }
};

// =========================
// CANCEL APPOINTMENT BY ADMIN
// =========================
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "cancelled",
      },
      {
        new: true,
      }
    ).populate("doctorId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment tidak ditemukan",
      });
    }

    await User.findByIdAndUpdate(appointment.userId, {
      $push: {
        notifications:
          "Appointment Anda dibatalkan oleh admin",
      },
      $inc: {
    unreadNotifications: 1,
  },
    });

    if (appointment.doctorId?.userId) {
      await User.findByIdAndUpdate(appointment.doctorId.userId, {
        $push: {
          notifications:
            "Salah satu appointment Anda dibatalkan oleh admin",
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment berhasil dibatalkan",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal membatalkan appointment",
      error: error.message,
    });
  }
};

module.exports = {
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
};