import { Link } from "react-router-dom";

function DashboardLayout({
  title,
  children,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logoutHandler =
    () => {
      localStorage.clear();
      window.location.href =
        "/login";
    };

  return (
    <div className="d-flex">

      <aside
        style={{
          width: "270px",
          minHeight: "100vh",
          background:
            "#7B5E57",
          color: "white",
          padding: "25px",
        }}
      >
        <h3>
          MediCare
        </h3>

        <hr />

        <p>
          {user?.name}
        </p>

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
            Doctors
          </Link>

          <Link
            className="btn btn-light"
            to="/appointments"
          >
            Appointment
          </Link>

          <Link
            className="btn btn-light"
            to="/notifications"
          >
            Notification
          </Link>

          {user?.role ===
            "user" && (
            <Link
              className="btn btn-light"
              to="/apply-doctor"
            >
              Apply Doctor
            </Link>
          )}

        </div>

        <button
          className="
          btn btn-danger
          mt-5
          w-100
        "
          onClick={
            logoutHandler
          }
        >
          Logout
        </button>

      </aside>

      <main
        className="
        flex-grow-1
        p-4
      "
      >
        <h2 className="mb-4">
          {title}
        </h2>

        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;