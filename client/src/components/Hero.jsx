import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="py-5 bg-light">

      <div className="container">

        <div className="row align-items-center">

          <div className="col-md-6">

            <h1 className="display-4 fw-bold">
              Temukan Dokter Terbaik
            </h1>

            <p className="lead mt-3">
              Cari dokter berdasarkan
              spesialisasi dan jadwalkan
              konsultasi dengan mudah.
            </p>

            <div className="mt-4">

              <Link
                to="/doctors"
                className="btn btn-primary me-2"
              >
                Cari Dokter
              </Link>

              <Link
                to="/register"
                className="btn btn-success"
              >
                Daftar Sekarang
              </Link>

            </div>

          </div>

          <div className="col-md-6 text-center">

            <img
              src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
              alt="doctor"
              width="250"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;