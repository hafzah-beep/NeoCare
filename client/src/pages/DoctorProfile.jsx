import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DoctorProfile() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "",
    experience: "",
    fees: "",
    address: "",
    schedule: "",
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

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

  const checkAccess = async () => {
    const token = localStorage.getItem("token");
    const user = getUserFromStorage();

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "doctor") {
      navigate("/dashboard");
      return;
    }

    await getDoctorProfile();
  };

  const getDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/doctors/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const doctorData = res.data.doctor;

      setDoctor(doctorData);

      setFormData({
        fullName: doctorData.fullName || "",
        specialization: doctorData.specialization || "",
        experience: doctorData.experience || "",
        fees: doctorData.fees || "",
        address: doctorData.address || "",
        schedule: doctorData.schedule || "",
      });
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal mengambil profil dokter"
      );
    } finally {
      setLoading(false);
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
      setSaveLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.put(
        "/doctors/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Profil dokter berhasil diperbarui");

      await getDoctorProfile();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal memperbarui profil dokter"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return <span className="badge bg-success">Approved</span>;
    }

    if (status === "rejected") {
      return <span className="badge bg-danger">Rejected</span>;
    }

    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "#F6F3EF",
        }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F6F3EF",
        }}
      >
        <div className="container py-5 text-center">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="card-body py-5">
              <h4 className="fw-bold">
                Profil dokter tidak ditemukan
              </h4>

              <p className="text-muted">
                Data dokter belum tersedia untuk akun ini.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/doctor/dashboard")}
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Profil Dokter
            </h2>

            <p className="text-muted mb-0">
              Kelola informasi praktik yang tampil untuk pasien
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/doctor/dashboard")}
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
                  Edit Informasi Praktik
                </h5>

                <p className="text-muted mb-4">
                  Perubahan data akan langsung digunakan pada daftar dokter.
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
                      value={formData.schedule}
                      onChange={changeHandler}
                    />

                    <small className="text-muted">
                      Contoh: Senin - Jumat, 09.00 - 15.00
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/doctor/dashboard")}
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saveLoading}
                    >
                      {saveLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* DETAIL */}
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
                  Ringkasan Profil
                </h5>

                <div className="mb-4">
                  <h5 className="fw-bold mb-1">
                    {doctor.fullName || "-"}
                  </h5>

                  <p className="text-muted mb-2">
                    {doctor.specialization || "-"}
                  </p>

                  {getStatusBadge(doctor.status)}
                </div>

                <hr />

                <div className="mb-3">
                  <small className="text-muted">
                    Pengalaman
                  </small>

                  <p className="fw-semibold mb-0">
                    {doctor.experience || 0} Tahun
                  </p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    Biaya Konsultasi
                  </small>

                  <p className="fw-semibold mb-0">
                    Rp {doctor.fees?.toLocaleString() || "0"}
                  </p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    Alamat Praktik
                  </small>

                  <p className="fw-semibold mb-0">
                    {doctor.address || "-"}
                  </p>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    Jadwal Praktik
                  </small>

                  <p className="fw-semibold mb-0">
                    {doctor.schedule || "-"}
                  </p>
                </div>

                <div className="mb-0">
                  <small className="text-muted">
                    Terdaftar Sejak
                  </small>

                  <p className="fw-semibold mb-0">
                    {formatDate(doctor.createdAt)}
                  </p>
                </div>

                <div
                  className="alert alert-info mt-4 mb-0"
                  style={{
                    borderRadius: "14px",
                  }}
                >
                  Data ini akan terlihat oleh pasien saat mencari dokter.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DoctorProfile;