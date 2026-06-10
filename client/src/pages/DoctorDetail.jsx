import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  const isGuest = !token || !user;
  const isUser = token && user?.role === "user";

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctor();
  }, []);

  const getDoctor = async () => {
    try {
      const res = await api.get("/doctors/all");

      const selectedDoctor = res.data.doctors.find(
        (item) => item._id === id
      );

      setDoctor(selectedDoctor || null);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil detail dokter");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  const goBack = () => {
    navigate("/doctors");
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
              borderRadius: "20px",
            }}
          >
            <div className="card-body py-5">
              <h4 className="fw-bold">
                Dokter tidak ditemukan
              </h4>

              <p className="text-muted">
                Data dokter tidak tersedia atau belum disetujui admin.
              </p>

              <button
                className="btn btn-primary"
                onClick={goBack}
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
              Detail Dokter
            </h2>

            <p className="text-muted mb-0">
              Lihat informasi dokter sebelum membuat appointment
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={goBack}
          >
            Kembali
          </button>
        </div>

        <div className="row g-4">

          {/* DETAIL UTAMA */}
          <div className="col-lg-8">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-4">

                <div className="d-flex gap-3 align-items-start mb-4">
                  <div
                    className="d-flex justify-content-center align-items-center flex-shrink-0"
                    style={{
                      width: "105px",
                      height: "105px",
                      borderRadius: "16px",
                      background: "#F8FAFC",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                      alt="doctor"
                      width="72"
                    />
                  </div>

                  <div>
                    <h3 className="fw-bold mb-1">
                      {doctor.fullName}
                    </h3>

                    <p className="text-muted mb-3">
                      {doctor.specialization}
                    </p>

                    <div className="d-flex flex-wrap gap-2">
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
                        {doctor.experience || 0} tahun pengalaman
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
                        Dokter tersedia
                      </span>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="mb-4">
                  <h5 className="fw-bold mb-3">
                    Informasi Praktik
                  </h5>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <small className="text-muted">
                        Spesialisasi
                      </small>

                      <p className="fw-semibold mb-0">
                        {doctor.specialization || "-"}
                      </p>
                    </div>

                    <div className="col-md-6 mb-3">
                      <small className="text-muted">
                        Pengalaman
                      </small>

                      <p className="fw-semibold mb-0">
                        {doctor.experience || 0} Tahun
                      </p>
                    </div>

                    <div className="col-md-6 mb-3">
                      <small className="text-muted">
                        Biaya Konsultasi
                      </small>

                      <p className="fw-semibold mb-0">
                        {formatCurrency(doctor.fees)}
                      </p>
                    </div>

                    <div className="col-md-6 mb-3">
                      <small className="text-muted">
                        Status
                      </small>

                      <p className="fw-semibold text-success mb-0">
                        Tersedia
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-2">
                    Alamat Praktik
                  </h5>

                  <p
                    className="mb-0"
                    style={{
                      lineHeight: "1.7",
                    }}
                  >
                    {doctor.address || "-"}
                  </p>
                </div>

                <div>
                  <h5 className="fw-bold mb-2">
                    Jadwal Praktik
                  </h5>

                  <p
                    className="mb-0"
                    style={{
                      lineHeight: "1.7",
                    }}
                  >
                    {doctor.schedule || "-"}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* PANEL BOOKING */}
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "20px",
                position: "sticky",
                top: "24px",
              }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  Buat Appointment
                </h5>

                <div className="mb-3">
                  <small className="text-muted">
                    Dokter
                  </small>

                  <p className="fw-semibold mb-0">
                    {doctor.fullName}
                  </p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    Biaya Konsultasi
                  </small>

                  <p className="fw-bold mb-0">
                    {formatCurrency(doctor.fees)}
                  </p>
                </div>

                <div className="mb-4">
                  <small className="text-muted">
                    Jadwal
                  </small>

                  <p className="fw-semibold mb-0">
                    {doctor.schedule || "-"}
                  </p>
                </div>

                {isUser ? (
                  <Link
                    to={`/book/${doctor._id}`}
                    className="btn btn-primary w-100"
                  >
                    Booking Sekarang
                  </Link>
                ) : isGuest ? (
                  <Link
                    to="/register"
                    className="btn btn-primary w-100"
                  >
                    Booking Sekarang
                  </Link>
                ) : (
                  <button
                    className="btn btn-secondary w-100"
                    disabled
                  >
                    Tidak Bisa Booking
                  </button>
                )}

                {isGuest && (
                  <p
                    className="text-muted mt-3 mb-0"
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    Anda perlu daftar terlebih dahulu untuk membuat appointment.
                  </p>
                )}

                {!isGuest && !isUser && (
                  <p
                    className="text-muted mt-3 mb-0"
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    Hanya akun pasien yang dapat melakukan booking.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DoctorDetail;