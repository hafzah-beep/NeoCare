import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import NotificationBell from "../components/NotificationBell";

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const logoutHandler = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    getDoctorAppointments();
  }, []);

  const getDoctorAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/appointments/doctor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalAppointment = appointments.length;

  const pendingAppointment = appointments.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedAppointment = appointments.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedAppointment = appointments.filter(
    (item) => item.status === "rejected"
  ).length;

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return <span className="badge bg-success">Approved</span>;
    }

    if (status === "rejected") {
      return <span className="badge bg-danger">Rejected</span>;
    }

    return <span className="badge bg-warning text-dark">Pending</span>;
  };

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
              Dashboard Dokter
            </h2>

            <p className="text-muted mb-0">
              Selamat datang, dr. {user?.name}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
  <NotificationBell />

  <button
    className="btn btn-outline-danger"
    onClick={logoutHandler}
  >
    Logout
  </button>
</div>
        </div>

        {/* STAT CARD */}
        <div className="row mb-4">

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "18px" }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Total Appointment
                </p>

                <h2 className="fw-bold mb-0">
                  {loading ? "..." : totalAppointment}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "18px" }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Pending
                </p>

                <h2 className="fw-bold mb-0">
                  {loading ? "..." : pendingAppointment}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "18px" }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Approved
                </p>

                <h2 className="fw-bold mb-0">
                  {loading ? "..." : approvedAppointment}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "18px" }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Rejected
                </p>

                <h2 className="fw-bold mb-0">
                  {loading ? "..." : rejectedAppointment}
                </h2>
              </div>
            </div>
          </div>

        </div>

        {/* MENU CEPAT */}
        <div className="d-flex flex-wrap gap-2 mb-5">
  <Link
    to="/doctor/appointments"
    className="btn btn-primary"
  >
    Kelola Appointment
  </Link>

  <Link
    to="/doctor/profile"
    className="btn btn-success"
  >
    Profil Dokter
  </Link>

  <Link
    to="/doctors"
    className="btn btn-outline-primary"
  >
    Lihat Daftar Dokter
  </Link>
</div>

        {/* APPOINTMENT TERBARU */}
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "20px" }}
        >
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">
                  Appointment Pasien Terbaru
                </h5>

                <p className="text-muted mb-0">
                  Daftar appointment yang masuk ke akun dokter Anda
                </p>
              </div>

              <Link
                to="/doctor/appointments"
                className="btn btn-outline-primary btn-sm"
              >
                Lihat Semua
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="alert alert-info mb-0">
                Belum ada appointment dari pasien.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Pasien</th>
                      <th>Tanggal</th>
                      <th>Jam</th>
                      <th>Keluhan</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.slice(0, 5).map((item) => (
                      <tr key={item._id}>
                        <td className="fw-semibold">
                          {item.userId?.name || "-"}
                        </td>

                        <td>
                          {item.date}
                        </td>

                        <td>
                          {item.time}
                        </td>

                        <td>
                          {item.complaint || "-"}
                        </td>

                        <td>
                          {getStatusBadge(item.status)}
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
    </div>
  );
}

export default DoctorDashboard;