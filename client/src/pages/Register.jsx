import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/register", formData);

      toast.success("Register berhasil");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Register gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#F6F3EF",
      }}
    >
      <div
        className="card border-0 shadow-sm"
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "22px",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">
              Buat Akun
            </h2>

            <p className="text-muted mb-0">
              Daftar untuk mulai booking dokter
            </p>
          </div>

          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nama Lengkap
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nomor Telepon
              </label>

              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Masukkan nomor telepon"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Sudah punya akun?
            </span>

            <Link
              to="/login"
              className="ms-2 text-decoration-none fw-semibold"
            >
              Login
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link
              to="/"
              className="text-muted text-decoration-none small"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;