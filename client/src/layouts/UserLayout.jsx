import { Link } from "react-router-dom";

function UserLayout({
  title,
  children,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="d-flex">

      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "#7B5E57",
          color: "white",
          padding: "30px",
        }}
      >
        <h3>
          MediCare
        </h3>

        <hr />

        <div className="d-grid gap-2">

          <Link
            className="btn btn-light"
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="btn btn-light"
            to="/doctors"
          >
            Booking Dokter
          </Link>

          <Link
            className="btn btn-light"
            to="/appointments"
          >
            Riwayat
          </Link>

          <Link
            className="btn btn-light"
            to="/notifications"
          >
            Notifikasi
          </Link>

          <Link
            className="btn btn-light"
            to="/apply-doctor"
          >
            Apply Doctor
          </Link>

        </div>

        <button
          className="btn btn-danger mt-5"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      <div className="flex-grow-1 p-4">

        <h2 className="page-title">
          {title}
        </h2>

        {children}

      </div>

    </div>
  );
}

export default UserLayout;