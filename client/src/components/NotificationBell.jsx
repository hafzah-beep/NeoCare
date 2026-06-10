import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount();

    const interval = setInterval(() => {
      getUnreadCount();
    }, 5000);

    const handleFocus = () => {
      getUnreadCount();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUnreadCount(res.data.user?.unreadNotifications || 0);
    } catch (error) {
      console.log(error);
      setUnreadCount(0);
    }
  };

  return (
    <Link
      to="/notifications"
      className="btn btn-light position-relative"
      style={{
        borderRadius: "12px",
        width: "44px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #E5E7EB",
        fontSize: "18px",
        textDecoration: "none",
      }}
    >
      🔔

      {unreadCount > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            fontSize: "11px",
            minWidth: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 6px",
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;