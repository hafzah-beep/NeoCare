import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Notifications() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccessAndGetNotifications();
  }, []);

  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  };

  const checkAccessAndGetNotifications = async () => {
    const token = localStorage.getItem("token");
    const localUser = getUserFromStorage();

    if (!token || !localUser) {
      navigate("/login");
      return;
    }

    await getNotifications(token);
    await markAsRead(token);
  };

  const getNotifications = async (token) => {
    try {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = res.data.user;

      setUser(userData);

      const notificationData = userData?.notifications || [];
      const reversedNotifications = [...notificationData].reverse();

      setNotifications(reversedNotifications);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil notifikasi");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (token) => {
    try {
      await api.put(
        "/auth/notifications/read",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const goBackDashboard = () => {
    const localUser = getUserFromStorage();

    if (localUser?.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (localUser?.role === "doctor") {
      navigate("/doctor/dashboard");
      return;
    }

    if (localUser?.role === "user") {
      navigate("/dashboard");
      return;
    }

    navigate("/");
  };

  const formatNotification = (notification) => {
    if (typeof notification === "string") {
      return notification;
    }

    if (notification?.message) {
      return notification.message;
    }

    return "Notifikasi baru";
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
              Notifikasi
            </h2>

            <p className="text-muted mb-0">
              Informasi terbaru untuk akun {user?.name}
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={goBackDashboard}
          >
            Kembali
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="card border-0 shadow-sm"
          style={{
            borderRadius: "22px",
          }}
        >
          <div className="card-body p-4">

            <div className="mb-4">
              <h5 className="fw-bold mb-1">
                Daftar Notifikasi
              </h5>

              <p className="text-muted mb-0">
                Semua notifikasi yang masuk ke akun Anda
              </p>
            </div>

            {notifications.length === 0 ? (
              <div
                className="text-center py-5"
                style={{
                  background: "#F8FAFC",
                  borderRadius: "18px",
                }}
              >
                <h5 className="fw-bold mb-2">
                  Belum ada notifikasi
                </h5>

                <p className="text-muted mb-0">
                  Notifikasi appointment dan akun akan muncul di halaman ini.
                </p>
              </div>
            ) : (
              <div className="d-grid gap-3">
                {notifications.map((notification, index) => {
                  const message = formatNotification(notification);

                  return (
                    <div
                      key={index}
                      className="p-3"
                      style={{
                        borderRadius: "16px",
                        background: "#0D6EFD",
                      }}
                    >
                      <p
                        className="mb-0"
                        style={{
                          fontSize: "15px",
                          lineHeight: "1.6",
                          color: "#FFFFFF",
                          fontWeight: "500",
                        }}
                      >
                        {message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Notifications;