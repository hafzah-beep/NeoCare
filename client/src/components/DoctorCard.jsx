import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  const isGuest = !token || !user;
  const isUser = token && user?.role === "user";

  const formatCurrency = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: "18px",
        width: "430px",
      }}
    >
      <div className="card-body p-3">
        <div className="d-flex gap-3 align-items-start">

          {/* FOTO */}
          <div
            className="d-flex justify-content-center align-items-center flex-shrink-0"
            style={{
              width: "92px",
              height: "92px",
              borderRadius: "14px",
              background: "#F8FAFC",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
              alt="doctor"
              width="62"
            />
          </div>

          {/* INFO */}
          <div className="flex-grow-1 text-start">
            <h6
              className="fw-bold mb-1"
              style={{
                fontSize: "16px",
                lineHeight: "1.3",
              }}
            >
              {doctor.fullName || "-"}
            </h6>

            <p
              className="text-muted mb-2"
              style={{
                fontSize: "14px",
              }}
            >
              {doctor.specialization || "-"}
            </p>

            <div className="d-flex flex-wrap gap-2 mb-2">
              <span
                className="badge text-dark"
                style={{
                  background: "#F1F1F1",
                  fontSize: "12px",
                  fontWeight: "500",
                  padding: "6px 8px",
                  borderRadius: "7px",
                }}
              >
                {doctor.experience || 0} tahun
              </span>

              <span
                className="badge text-dark"
                style={{
                  background: "#F1F1F1",
                  fontSize: "12px",
                  fontWeight: "500",
                  padding: "6px 8px",
                  borderRadius: "7px",
                }}
              >
                Tersedia
              </span>
            </div>

            <p
              className="fw-bold mb-1"
              style={{
                fontSize: "15px",
              }}
            >
              {formatCurrency(doctor.fees)}
            </p>

            <p
              className="text-muted mb-3"
              style={{
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              {doctor.schedule || "Jadwal belum tersedia"}
            </p>

            <div className="d-flex gap-2">
              <Link
                to={`/doctor/${doctor._id}`}
                className="btn btn-outline-primary btn-sm flex-fill"
              >
                Detail
              </Link>

              {isUser ? (
                <Link
                  to={`/book/${doctor._id}`}
                  className="btn btn-primary btn-sm flex-fill"
                >
                  Booking
                </Link>
              ) : isGuest ? (
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm flex-fill"
                >
                  Booking
                </Link>
              ) : (
                <button
                  className="btn btn-secondary btn-sm flex-fill"
                  disabled
                >
                  Tidak Bisa
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorCard;