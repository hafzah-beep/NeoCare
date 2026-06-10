import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaint, setComplaint] = useState("");
  const [document, setDocument] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    checkAccess();
  }, []);

  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  };

  const checkAccess = async () => {
    const token = localStorage.getItem("token");
    const user = getUserFromStorage();

    if (!token || !user) {
      navigate("/register");
      return;
    }

    if (user.role !== "user") {
      navigate("/doctors");
      return;
    }

    await getDoctor();
  };

  const getDoctor = async () => {
    try {
      const res = await api.get("/doctors/all");

      const selectedDoctor = res.data.doctors.find(
        (item) => item._id === doctorId
      );

      setDoctor(selectedDoctor || null);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil data dokter");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!date || !time || !complaint) {
      alert("Tanggal, jam, dan keluhan wajib diisi");
      return;
    }

    const token = localStorage.getItem("token");
    const user = getUserFromStorage();

    if (!token || !user) {
      navigate("/register");
      return;
    }

    if (user.role !== "user") {
      alert("Hanya pasien yang bisa melakukan booking");
      navigate("/doctors");
      return;
    }

    try {
      setSubmitLoading(true);

      const formData = new FormData();

      formData.append("doctorId", doctorId);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("complaint", complaint);

      if (document) {
        formData.append("document", document);
      }

      const res = await api.post("/appointments/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message || "Appointment berhasil dibuat");

      navigate("/appointments");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal membuat appointment. Coba lagi."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "#F6F3EF",
        }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F6F3EF",
        }}
      >
        <div className="container py-5 text-center">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "22px",
            }}
          >
            <div className="card-body py-5">
              <div
                style={{
                  fontSize: "50px",
                }}
              >
                🩺
              </div>

              <h3 className="fw-bold mt-3">
                Dokter tidak ditemukan
              </h3>

              <p className="text-muted">
                Data dokter tidak tersedia atau belum disetujui admin.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/doctors")}
              >
                Kembali ke Daftar Dokter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F3EF",
      }}
    >
      <div className="container py-5 text-start">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Booking Appointment
            </h2>

            <p className="text-muted mb-0">
              Lengkapi data appointment sebelum dikirim ke dokter
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/doctors")}
          >
            Kembali
          </button>
        </div>

        <div className="row">

          {/* DOCTOR INFO */}
          <div className="col-md-4 mb-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "22px",
              }}
            >
              <div className="card-body p-4 text-center">
                <div
                  className="mx-auto mb-3 d-flex justify-content-center align-items-center"
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "18px",
                    background: "#F8FAFC",
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                    alt="doctor"
                    width="78"
                  />
                </div>

                <h4 className="fw-bold mb-1">
                  {doctor.fullName}
                </h4>

                <p className="text-muted mb-3">
                  {doctor.specialization}
                </p>

                <div className="d-flex justify-content-center gap-2 mb-4">
                  <span
                    className="badge text-dark"
                    style={{
                      background: "#F1F1F1",
                      fontSize: "13px",
                      fontWeight: "500",
                      padding: "7px 10px",
                      borderRadius: "7px",
                    }}
                  >
                    💼 {doctor.experience} tahun
                  </span>

                  <span
                    className="badge text-dark"
                    style={{
                      background: "#F1F1F1",
                      fontSize: "13px",
                      fontWeight: "500",
                      padding: "7px 10px",
                      borderRadius: "7px",
                    }}
                  >
                    👍 100%
                  </span>
                </div>

                <div
                  className="p-3 mb-3"
                  style={{
                    background: "#F8FAFC",
                    borderRadius: "16px",
                  }}
                >
                  <small className="text-muted">
                    Biaya Konsultasi
                  </small>

                  <h5 className="fw-bold mb-0">
                    Rp {doctor.fees?.toLocaleString()}
                  </h5>
                </div>

                <div
                  className="p-3 text-start"
                  style={{
                    background: "#F8FAFC",
                    borderRadius: "16px",
                  }}
                >
                  <small className="text-muted">
                    Jadwal Praktik
                  </small>

                  <p className="fw-semibold mb-0 mt-1">
                    {doctor.schedule || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM BOOKING */}
          <div className="col-md-8 mb-4">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "22px",
              }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  Form Appointment
                </h5>

                <form onSubmit={submitHandler}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Tanggal Appointment
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Jam Appointment
                      </label>

                      <input
                        type="time"
                        className="form-control"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Keluhan Pasien
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Tuliskan keluhan yang ingin dikonsultasikan..."
                      value={complaint}
                      onChange={(e) => setComplaint(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Dokumen Pendukung
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setDocument(e.target.files[0])}
                    />

                    <small className="text-muted">
                      Opsional. Bisa berupa hasil pemeriksaan, resep, atau dokumen lain.
                    </small>
                  </div>

                  <div
                    className="alert alert-info"
                    style={{
                      borderRadius: "14px",
                    }}
                  >
                    Appointment yang kamu buat akan masuk dengan status{" "}
                    <strong>pending</strong> sampai dokter menyetujui atau menolak.
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/doctors")}
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitLoading}
                    >
                      {submitLoading ? "Mengirim..." : "Kirim Appointment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default BookAppointment;