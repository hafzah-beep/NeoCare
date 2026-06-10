import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">

        <Link
          className="navbar-brand fw-bold text-primary"
          to="/"
        >
          Doctor Booking
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
              >
                Beranda
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/doctors"
              >
                Dokter
              </Link>
            </li>

            <li className="nav-item">
              <a
                href="#spesialisasi"
                className="nav-link"
              >
                Spesialisasi
              </a>
            </li>

            <li className="nav-item">
              <a
                href="#faq"
                className="nav-link"
              >
                FAQ
              </a>
            </li>

          </ul>

          <div>

            <Link
              to="/login"
              className="btn btn-outline-primary me-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary"
            >
              Daftar
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;