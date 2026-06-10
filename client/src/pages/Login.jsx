import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success("Login berhasil");

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login gagal"
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
          maxWidth: "430px",
          borderRadius: "22px",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">
              NeoCare
            </h2>

            <p className="text-muted mb-0">
              Masuk ke akun Anda
            </p>
          </div>

          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">
              Belum punya akun?
            </span>

            <Link
              to="/register"
              className="ms-2 text-decoration-none fw-semibold"
            >
              Daftar
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

export default Login;