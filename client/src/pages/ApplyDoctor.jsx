import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ApplyDoctor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "",
    experience: "",
    fees: "",
    address: "",
    schedule: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  };

  const checkAccess = () => {
    const token = localStorage.getItem("token");
    const user = getUserFromStorage();

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "user") {
      navigate("/dashboard");
    }
  };

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.specialization ||
      !formData.experience ||
      !formData.fees ||
      !formData.address ||
      !formData.schedule
    ) {
      alert("Semua data wajib diisi");
      return;
    }

    if (Number(formData.experience) < 0) {
      alert("Pengalaman tidak boleh kurang dari 0");
      return;
    }

    if (Number(formData.fees) <= 0) {
      alert("Biaya konsultasi harus lebih dari 0");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/doctors/apply",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Pengajuan dokter berhasil dikirim");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Gagal mengirim pengajuan dokter"
      );
    } finally {
      setLoading(false);
    }
  };

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
              Ajukan Menjadi Dokter
            </h2>

            <p className="text-muted mb-0">
              Lengkapi data praktik untuk diajukan ke admin
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Kembali
          </button>
        </div>

        <div className="row g-4">

          {/* FORM */}
          <div className="col-lg-8">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1">
                  Data Pengajuan
                </h5>

                <p className="text-muted mb-4">
                  Pastikan data yang dimasukkan sudah sesuai dengan informasi praktik Anda.
                </p>

                <form onSubmit={submitHandler}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nama Lengkap Dokter
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Contoh: dr. Andi Pratama"
                      value={formData.fullName}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Spesialisasi
                      </label>

                      <select
                        name="specialization"
                        className="form-select"
                        value={formData.specialization}
                        onChange={changeHandler}
                      >
                        <option value="">Pilih Spesialisasi</option>
                        <option value="Dokter Umum">Dokter Umum</option>
                        <option value="Dokter Anak">Dokter Anak</option>
                        <option value="Dokter Gigi">Dokter Gigi</option>
                        <option value="Dokter Kulit">Dokter Kulit</option>
                        <option value="Dokter Jantung">Dokter Jantung</option>
                        <option value="Dokter Mata">Dokter Mata</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Pengalaman
                      </label>

                      <input
                        type="number"
                        name="experience"
                        className="form-control"
                        placeholder="Contoh: 5"
                        value={formData.experience}
                        onChange={changeHandler}
                      />

                      <small className="text-muted">
                        Isi dalam satuan tahun
                      </small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Biaya Konsultasi
                    </label>

                    <input
                      type="number"
                      name="fees"
                      className="form-control"
                      placeholder="Contoh: 150000"
                      value={formData.fees}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Alamat Praktik
                    </label>

                    <textarea
                      name="address"
                      className="form-control"
                      rows="3"
                      placeholder="Tuliskan alamat praktik lengkap"
                      value={formData.address}
                      onChange={changeHandler}
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Jadwal Praktik
                    </label>

                    <input
                      type="text"
                      name="schedule"
                      className="form-control"
                      placeholder="Contoh: Senin - Jumat, 09.00 - 15.00"
                      value={formData.schedule}
                      onChange={changeHandler}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/dashboard")}
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Mengirim..." : "Kirim Pengajuan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "20px",
                position: "sticky",
                top: "24px",
              }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  Informasi Pengajuan
                </h5>

                <p className="text-muted">
                  Setelah pengajuan dikirim, admin akan meninjau data dokter terlebih dahulu.
                </p>

                <hr />

                <div className="mb-3">
                  <small className="text-muted">
                    Status Awal
                  </small>

                  <p className="fw-semibold mb-0">
                    Pending
                  </p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    Setelah Disetujui
                  </small>

                  <p className="fw-semibold mb-0">
                    Akun Anda akan berubah menjadi dokter
                  </p>
                </div>

                <div className="mb-0">
                  <small className="text-muted">
                    Catatan
                  </small>

                  <p className="fw-semibold mb-0">
                    Dokter yang belum disetujui belum akan tampil di daftar dokter.
                  </p>
                </div>

                <div
                  className="alert alert-info mt-4 mb-0"
                  style={{
                    borderRadius: "14px",
                  }}
                >
                  Anda akan mendapat notifikasi setelah admin memproses pengajuan.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ApplyDoctor;