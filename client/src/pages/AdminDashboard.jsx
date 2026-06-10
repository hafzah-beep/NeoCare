import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import NotificationBell from "../components/NotificationBell";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const logoutHandler = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    getDashboardData();

    const handleFocus = () => {
      getDashboardData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const statsRes = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const appointmentRes = await api.get("/admin/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const appointmentData = appointmentRes.data.appointments || [];

      const sortedAppointments = appointmentData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setStats(statsRes.data.stats || {});
      setAppointments(sortedAppointments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const latestActiveAppointments = appointments.filter(
    (item) => item.status === "pending" || item.status === "approved"
  );

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
              Admin Dashboard
            </h2>

            <p className="text-muted mb-0">
              Selamat datang, {user?.name}
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

        {/* SUMMARY */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
              }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Total User
                </p>

                <h2 className="fw-bold mb-0">
                  {loading ? "..." : stats.totalUsers || 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
              }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Total Dokter
                </p>

                <h2 className="fw-bold mb-0">
                  {loading ? "..." : stats.totalDoctors || 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
              }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Dokter Pending
                </p>

                <h2 className="fw-bold text-warning mb-0">
                  {loading ? "..." : stats.pendingDoctors || 0}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
              }}
            >
              <div className="card-body">
                <p className="text-muted mb-2">
                  Total Appointment
                </p>

                <h2 className="fw-bold mb-0">
                  {loading ? "..." : stats.totalAppointments || 0}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* MENU CEPAT */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "20px",
          }}
        >
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              Menu Cepat
            </h5>

            <div className="d-flex flex-wrap gap-2">
              <Link
                to="/admin/doctors"
                className="btn btn-primary"
              >
                Kelola Dokter
              </Link>

              <Link
                to="/admin/users"
                className="btn btn-success"
              >
                Kelola User
              </Link>

              <Link
                to="/admin/appointments"
                className="btn btn-warning text-dark"
              >
                Kelola Appointment
              </Link>

              <Link
                to="/doctors"
                className="btn btn-info text-white"
              >
                Lihat Daftar Dokter
              </Link>
            </div>
          </div>
        </div>

        {/* APPOINTMENT TERBARU */}
        <div
          className="card border-0 shadow-sm"
          style={{
            borderRadius: "20px",
          }}
        >
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">
                  Appointment Terbaru
                </h5>

                <p className="text-muted mb-0">
                  Appointment aktif terbaru dari pasien
                </p>
              </div>

              <Link
                to="/admin/appointments"
                className="btn btn-outline-primary btn-sm"
              >
                Lihat Semua
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : latestActiveAppointments.length === 0 ? (
              <div
                className="alert alert-info mb-0"
                style={{
                  borderRadius: "14px",
                }}
              >
                Belum ada appointment aktif.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Pasien</th>
                      <th>Dokter</th>
                      <th>Spesialisasi</th>
                      <th>Tanggal</th>
                      <th>Jam</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestActiveAppointments.slice(0, 5).map((item) => (
                      <tr key={item._id}>
                        <td className="fw-semibold">
                          {item.userId?.name || "-"}
                        </td>

                        <td>
                          {item.doctorId?.fullName || "-"}
                        </td>

                        <td>
                          {item.doctorId?.specialization || "-"}
                        </td>

                        <td>
                          {formatDate(item.date)}
                        </td>

                        <td>
                          {item.time || "-"}
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

export default AdminDashboard;