import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDoctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, search, statusFilter]);

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

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    await getDoctors();
  };

  const getDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.doctors || [];

      const sortedData = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setDoctors(sortedData);
      setSelectedDoctor(sortedData[0] || null);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil data dokter");
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let result = [...doctors];

    if (search.trim() !== "") {
      const keyword = search.toLowerCase();

      result = result.filter((doctor) => {
        return (
          doctor.fullName?.toLowerCase().includes(keyword) ||
          doctor.specialization?.toLowerCase().includes(keyword) ||
          doctor.address?.toLowerCase().includes(keyword) ||
          doctor.userId?.email?.toLowerCase().includes(keyword)
        );
      });
    }

    if (statusFilter !== "") {
      result = result.filter((doctor) => doctor.status === statusFilter);
    }

    setFilteredDoctors(result);
  };

  const approveDoctor = async () => {
    if (!selectedDoctor) return;

    const confirmApprove = window.confirm(
      `Setujui pengajuan dokter ${selectedDoctor.fullName}?`
    );

    if (!confirmApprove) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/admin/approve",
        { doctorId: selectedDoctor._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Dokter berhasil disetujui");
      await getDoctors();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal menyetujui dokter"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const rejectDoctor = async () => {
    if (!selectedDoctor) return;

    const confirmReject = window.confirm(
      `Tolak pengajuan dokter ${selectedDoctor.fullName}?`
    );

    if (!confirmReject) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/admin/reject",
        { doctorId: selectedDoctor._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Dokter berhasil ditolak");
      await getDoctors();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal menolak dokter"
      );
    } finally {
      setActionLoading(false);
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

  const canProcess = selectedDoctor?.status === "pending";

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F3EF",
      }}
    >
      <div className="container py-5 text-start">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Kelola Dokter
            </h2>

            <p className="text-muted mb-0">
              Tinjau data dan pengajuan dokter
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/dashboard")}
          >
            Kembali
          </button>
        </div>

        <div className="row g-4">

          {/* TABLE */}
          <div className="col-lg-8">
            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h5 className="fw-bold mb-1">
                      Daftar Dokter
                    </h5>

                    <p className="text-muted mb-0">
                      {filteredDoctors.length} dari {doctors.length} dokter ditampilkan
                    </p>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-8 mb-3 mb-md-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari nama, email, spesialisasi, atau alamat..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">Semua Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {filteredDoctors.length === 0 ? (
                  <div
                    className="text-center py-5"
                    style={{
                      background: "#F8FAFC",
                      borderRadius: "16px",
                    }}
                  >
                    <h6 className="fw-bold">
                      Data tidak ditemukan
                    </h6>

                    <p className="text-muted mb-0">
                      Coba gunakan kata kunci atau filter lain.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Nama Dokter</th>
                          <th>Email</th>
                          <th>Spesialisasi</th>
                          <th>Status</th>
                          <th>Terdaftar</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredDoctors.map((doctor) => (
                          <tr
                            key={doctor._id}
                            onClick={() => setSelectedDoctor(doctor)}
                            style={{
                              cursor: "pointer",
                              background:
                                selectedDoctor?._id === doctor._id
                                  ? "#F1F6FF"
                                  : "transparent",
                            }}
                          >
                            <td className="fw-semibold">
                              {doctor.fullName || "-"}
                            </td>

                            <td className="text-muted">
                              {doctor.userId?.email || "-"}
                            </td>

                            <td>
                              {doctor.specialization || "-"}
                            </td>

                            <td>
                              {getStatusBadge(doctor.status)}
                            </td>

                            <td>
                              {formatDate(doctor.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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
                  Detail Dokter
                </h5>

                {!selectedDoctor ? (
                  <p className="text-muted mb-0">
                    Pilih salah satu dokter dari tabel.
                  </p>
                ) : (
                  <>
                    <div className="mb-4">
                      <h5 className="fw-bold mb-1">
                        {selectedDoctor.fullName || "-"}
                      </h5>

                      <p className="text-muted mb-2">
                        {selectedDoctor.specialization || "-"}
                      </p>

                      {getStatusBadge(selectedDoctor.status)}
                    </div>

                    <hr />

                    <div className="mb-3">
                      <small className="text-muted">Email Akun</small>
                      <p className="fw-semibold mb-0">
                        {selectedDoctor.userId?.email || "-"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Pengalaman</small>
                      <p className="fw-semibold mb-0">
                        {selectedDoctor.experience || 0} Tahun
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Biaya Konsultasi</small>
                      <p className="fw-semibold mb-0">
                        Rp {selectedDoctor.fees?.toLocaleString() || "0"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Alamat Praktik</small>
                      <p className="fw-semibold mb-0">
                        {selectedDoctor.address || "-"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Jadwal Praktik</small>
                      <p className="fw-semibold mb-0">
                        {selectedDoctor.schedule || "-"}
                      </p>
                    </div>

                    <div className="mb-4">
                      <small className="text-muted">Tanggal Pengajuan</small>
                      <p className="fw-semibold mb-0">
                        {formatDate(selectedDoctor.createdAt)}
                      </p>
                    </div>

                    {canProcess ? (
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-success"
                          disabled={actionLoading}
                          onClick={approveDoctor}
                        >
                          {actionLoading ? "Memproses..." : "Approve Dokter"}
                        </button>

                        <button
                          className="btn btn-outline-danger"
                          disabled={actionLoading}
                          onClick={rejectDoctor}
                        >
                          Reject Dokter
                        </button>
                      </div>
                    ) : (
                      <div
                        className="alert alert-secondary mb-0"
                        style={{
                          borderRadius: "14px",
                        }}
                      >
                        Tidak ada aksi untuk status dokter ini.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDoctors;