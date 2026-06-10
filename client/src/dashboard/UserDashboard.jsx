import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import NotificationBell from "../components/NotificationBell";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const logoutHandler = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    getUserData();

    const handleFocus = () => {
      getUserData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getUserData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const appointmentRes = await api.get("/appointments/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = appointmentRes.data.appointments || [];

      const sortedData = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAppointments(sortedData);
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
              Halo, {user?.name}
            </h2>

            <p className="text-muted mb-0">
              Selamat datang di dashboard NeoCare
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
                to="/doctors"
                className="btn btn-primary"
              >
                Booking Dokter
              </Link>

              <Link
                to="/appointments"
                className="btn btn-success"
              >
                Riwayat Appointment
              </Link>

              <Link
                to="/apply-doctor"
                className="btn btn-info text-white"
              >
                Ajukan Menjadi Dokter
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
                  Ringkasan appointment aktif terakhir Anda
                </p>
              </div>

              <Link
                to="/appointments"
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
                Belum ada appointment aktif. Silakan booking dokter terlebih dahulu.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
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

export default UserDashboard;