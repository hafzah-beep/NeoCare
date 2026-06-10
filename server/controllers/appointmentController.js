const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// =======================
// BOOK APPOINTMENT
// =======================
const bookAppointment = async (req, res) => {
  try {
    const appointment = new Appointment({
      userId: req.userId,
      doctorId: req.body.doctorId,
      date: req.body.date,
      time: req.body.time,
      complaint: req.body.complaint,
      document: req.file?.filename || "",
    });

    await appointment.save();

   const doctor = await Doctor.findById(req.body.doctorId);

if (doctor?.userId) {
  await User.findByIdAndUpdate(doctor.userId, {
    $push: {
      notifications: "Ada appointment baru dari pasien",
    },
    $inc: {
      unreadNotifications: 1,
    },
  });
}

await User.updateMany(
  { role: "admin" },
  {
    $push: {
      notifications: "Ada appointment baru yang masuk",
    },
    $inc: {
      unreadNotifications: 1,
    },
  }
);

    res.status(201).json({
      success: true,
      message: "Appointment berhasil dibuat",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat appointment",
      error: error.message,
    });
  }
};

// =======================
// GET USER APPOINTMENTS
// =======================
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.userId,
    }).populate("doctorId");

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil appointment user",
      error: error.message,
    });
  }
};

// =======================
// GET DOCTOR APPOINTMENTS
// =======================
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.userId,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor tidak ditemukan",
      });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
    })
      .populate("userId")
      .populate("doctorId");

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil appointment dokter",
      error: error.message,
    });
  }
};

// =======================
// APPROVE APPOINTMENT
// =======================
const approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "approved",
      },
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment tidak ditemukan",
      });
    }

    await User.findByIdAndUpdate(appointment.userId, {
      $push: {
        notifications: "Appointment Anda telah disetujui",
      },
      $inc: {
       unreadNotifications: 1,
      },
    });

    res.status(200).json({
      success: true,
      message: "Appointment berhasil disetujui",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal approve appointment",
      error: error.message,
    });
  }
};

// =======================
// REJECT APPOINTMENT
// =======================
const rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "rejected",
      },
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment tidak ditemukan",
      });
    }

    await User.findByIdAndUpdate(appointment.userId, {
      $push: {
        notifications: "Appointment Anda ditolak",
      },
      $inc: {
    unreadNotifications: 1,
  },
    });

    res.status(200).json({
      success: true,
      message: "Appointment berhasil ditolak",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal reject appointment",
      error: error.message,
    });
  }
};

// =======================
// EXPORT
// =======================
module.exports = {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
};