import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container text-center mt-5">

      <h1 className="display-1">
        404
      </h1>

      <h3>
        Halaman Tidak Ditemukan
      </h3>

      <Link
        to="/"
        className="btn btn-primary mt-3"
      >
        Kembali ke Beranda
      </Link>

    </div>
  );
}

export default NotFound;