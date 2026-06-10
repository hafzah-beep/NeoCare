import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AppointmentHistory() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const serverUrl = "http://localhost:5000";

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, search, statusFilter, dateFilter]);

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
      navigate("/login");
      return;
    }

    if (user.role !== "user") {
      navigate("/doctors");
      return;
    }

    await getAppointments();
  };

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/appointments/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.appointments || [];

      const sortedData = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAppointments(sortedData);
      setSelectedAppointment(sortedData[0] || null);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil data appointment");
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let result = [...appointments];

    if (search.trim() !== "") {
      const keyword = search.toLowerCase();

      result = result.filter((appointment) => {
        return (
          appointment.doctorId?.fullName?.toLowerCase().includes(keyword) ||
          appointment.doctorId?.specialization?.toLowerCase().includes(keyword) ||
          appointment.complaint?.toLowerCase().includes(keyword)
        );
      });
    }

    if (statusFilter !== "") {
      result = result.filter((appointment) => appointment.status === statusFilter);
    }

    if (dateFilter !== "") {
      result = result.filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
          .toISOString()
          .split("T")[0];

        return appointmentDate === dateFilter;
      });
    }

    setFilteredAppointments(result);
  };

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return <span className="badge bg-success">Approved</span>;
    }

    if (status === "rejected") {
      return <span className="badge bg-danger">Rejected</span>;
    }

    if (status === "cancelled") {
      return <span className="badge bg-secondary">Cancelled</span>;
    }

    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDocumentUrl = (document) => {
    if (!document) return "#";

    if (document.startsWith("http")) {
      return document;
    }

    return `${serverUrl}/uploads/${document}`;
  };

  const getStatusMessage = (status) => {
    if (status === "approved") {
      return (
        <div
          className="alert alert-success mb-0"
          style={{
            borderRadius: "14px",
          }}
        >
          Appointment ini sudah disetujui oleh dokter.
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div
          className="alert alert-danger mb-0"
          style={{
            borderRadius: "14px",
          }}
        >
          Appointment ini ditolak oleh dokter.
        </div>
      );
    }

    if (status === "cancelled") {
      return (
        <div
          className="alert alert-secondary mb-0"
          style={{
            borderRadius: "14px",
          }}
        >
          Appointment ini telah dibatalkan.
        </div>
      );
    }

    return (
      <div
        className="alert alert-warning mb-0"
        style={{
          borderRadius: "14px",
        }}
      >
        Appointment masih menunggu persetujuan dokter.
      </div>
    );
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
              Riwayat Appointment
            </h2>

            <p className="text-muted mb-0">
              Pantau status appointment yang sudah Anda buat
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Kembali
          </button>
        </div>

        {appointments.length === 0 ? (
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center py-5">
              <h4 className="fw-bold">
                Belum ada appointment
              </h4>

              <p className="text-muted">
                Anda belum membuat appointment dengan dokter.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/doctors")}
              >
                Cari Dokter
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">

            {/* TABLE */}
            <div className="col-lg-8">
              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "20px",
                }}
              >
                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">
                        Daftar Appointment
                      </h5>

                      <p className="text-muted mb-0">
                        {filteredAppointments.length} dari {appointments.length} appointment ditampilkan
                      </p>
                    </div>
                  </div>

                  {/* FILTER */}
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Cari dokter, spesialisasi, atau keluhan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3 mb-3 mb-md-0">
                      <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <input
                        type="date"
                        className="form-control"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  {filteredAppointments.length === 0 ? (
                    <div
                      className="text-center py-5"
                      style={{
                        background: "#F8FAFC",
                        borderRadius: "16px",
                      }}
                    >
                      <h6 className="fw-bold">
                        Data tidak ditemukan
                      </h6>

                      <p className="text-muted mb-0">
                        Coba gunakan kata kunci atau filter lain.
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Dokter</th>
                            <th>Keluhan</th>
                            <th>Tanggal</th>
                            <th>Jam</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredAppointments.map((appointment) => (
                            <tr
                              key={appointment._id}
                              onClick={() => setSelectedAppointment(appointment)}
                              style={{
                                cursor: "pointer",
                                background:
                                  selectedAppointment?._id === appointment._id
                                    ? "#F1F6FF"
                                    : "transparent",
                              }}
                            >
                              <td>
                                <div className="fw-semibold">
                                  {appointment.doctorId?.fullName || "-"}
                                </div>

                                <small className="text-muted">
                                  {appointment.doctorId?.specialization || "-"}
                                </small>
                              </td>

                              <td>
                                <span
                                  style={{
                                    display: "inline-block",
                                    maxWidth: "220px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {appointment.complaint || "-"}
                                </span>
                              </td>

                              <td>
                                {formatDate(appointment.date)}
                              </td>

                              <td>
                                {appointment.time || "-"}
                              </td>

                              <td>
                                {getStatusBadge(appointment.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* DETAIL */}
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
                    Detail Appointment
                  </h5>

                  {!selectedAppointment ? (
                    <p className="text-muted mb-0">
                      Pilih salah satu appointment dari tabel.
                    </p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h5 className="fw-bold mb-1">
                          {selectedAppointment.doctorId?.fullName || "Dokter"}
                        </h5>

                        <p className="text-muted mb-2">
                          {selectedAppointment.doctorId?.specialization || "-"}
                        </p>

                        {getStatusBadge(selectedAppointment.status)}
                      </div>

                      <hr />

                      <div className="mb-3">
                        <small className="text-muted">
                          Tanggal
                        </small>

                        <p className="fw-semibold mb-0">
                          {formatDate(selectedAppointment.date)}
                        </p>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          Jam
                        </small>

                        <p className="fw-semibold mb-0">
                          {selectedAppointment.time || "-"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          Keluhan
                        </small>

                        <p
                          className="fw-semibold mb-0"
                          style={{
                            lineHeight: "1.6",
                          }}
                        >
                          {selectedAppointment.complaint || "-"}
                        </p>
                      </div>

                      <div className="mb-4">
                        <small className="text-muted">
                          Dokumen Pendukung
                        </small>

                        <div className="mt-1">
                          {selectedAppointment.document ? (
                            <a
                              href={getDocumentUrl(selectedAppointment.document)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              Lihat Dokumen
                            </a>
                          ) : (
                            <p className="fw-semibold mb-0">
                              Tidak ada dokumen
                            </p>
                          )}
                        </div>
                      </div>

                      {getStatusMessage(selectedAppointment.status)}
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default AppointmentHistory;