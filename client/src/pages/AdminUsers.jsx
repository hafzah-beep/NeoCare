import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const adminUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search, roleFilter, statusFilter]);

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

    await getUsers();
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.users || [];

      const sortedData = data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setUsers(sortedData);
      setSelectedUser(sortedData[0] || null);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    if (search.trim() !== "") {
      const keyword = search.toLowerCase();

      result = result.filter((user) => {
        return (
          user.name?.toLowerCase().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword) ||
          user.role?.toLowerCase().includes(keyword)
        );
      });
    }

    if (roleFilter !== "") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "") {
      result = result.filter((user) => {
        const isActive = user.isActive !== false;

        if (statusFilter === "active") return isActive;
        if (statusFilter === "inactive") return !isActive;

        return true;
      });
    }

    setFilteredUsers(result);
  };

  const updateUserRole = async (newRole) => {
    if (!selectedUser) return;

    if (newRole === selectedUser.role) return;

    const confirmUpdate = window.confirm(
      `Ubah role ${selectedUser.name} menjadi ${newRole}?`
    );

    if (!confirmUpdate) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.put(
        `/admin/users/${selectedUser._id}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Role user berhasil diubah");

      await getUsers();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal mengubah role user"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const toggleUserStatus = async () => {
    if (!selectedUser) return;

    const currentStatus = selectedUser.isActive !== false;
    const newStatus = !currentStatus;

    const confirmUpdate = window.confirm(
      newStatus
        ? `Aktifkan akun ${selectedUser.name}?`
        : `Nonaktifkan akun ${selectedUser.name}?`
    );

    if (!confirmUpdate) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.put(
        `/admin/users/${selectedUser._id}/status`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Status user berhasil diubah");

      await getUsers();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal mengubah status user"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    const confirmDelete = window.confirm(
      `Hapus akun ${selectedUser.name}? Data yang dihapus tidak bisa dikembalikan.`
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.delete(`/admin/users/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message || "User berhasil dihapus");

      await getUsers();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Gagal menghapus user"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return <span className="badge bg-dark">Admin</span>;
    }

    if (role === "doctor") {
      return <span className="badge bg-primary">Doctor</span>;
    }

    return <span className="badge bg-success">User</span>;
  };

  const getStatusBadge = (isActive) => {
    if (isActive === false) {
      return <span className="badge bg-danger">Inactive</span>;
    }

    return <span className="badge bg-success">Active</span>;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const selectedUserIsCurrentAdmin =
    selectedUser &&
    (selectedUser._id === adminUser?._id || selectedUser._id === adminUser?.id);

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

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Kelola User
            </h2>

            <p className="text-muted mb-0">
              Manajemen akun pengguna NeoCare
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

          {/* TABLE AREA */}
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
                      Daftar Akun
                    </h5>

                    <p className="text-muted mb-0">
                      {filteredUsers.length} dari {users.length} akun ditampilkan
                    </p>
                  </div>
                </div>

                {/* FILTER */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari nama atau email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="col-md-3 mb-3 mb-md-0">
                    <select
                      className="form-select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="">Semua Role</option>
                      <option value="user">User</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">Semua Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
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
                          <th>Nama</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Terdaftar</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            style={{
                              cursor: "pointer",
                              background:
                                selectedUser?._id === user._id
                                  ? "#F1F6FF"
                                  : "transparent",
                            }}
                          >
                            <td className="fw-semibold">
                              {user.name || "-"}
                            </td>

                            <td className="text-muted">
                              {user.email || "-"}
                            </td>

                            <td>
                              {getRoleBadge(user.role)}
                            </td>

                            <td>
                              {getStatusBadge(user.isActive)}
                            </td>

                            <td>
                              {formatDate(user.createdAt)}
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

          {/* DETAIL PANEL */}
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
                  Detail Akun
                </h5>

                {!selectedUser ? (
                  <p className="text-muted mb-0">
                    Pilih salah satu akun dari tabel.
                  </p>
                ) : (
                  <>
                    <div className="mb-4">
                      <h5 className="fw-bold mb-1">
                        {selectedUser.name || "-"}
                      </h5>

                      <p className="text-muted mb-2">
                        {selectedUser.email || "-"}
                      </p>

                      <div className="d-flex gap-2">
                        {getRoleBadge(selectedUser.role)}
                        {getStatusBadge(selectedUser.isActive)}
                      </div>
                    </div>

                    <hr />

                    <div className="mb-3">
                      <small className="text-muted">
                        Tanggal Daftar
                      </small>

                      <p className="fw-semibold mb-0">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Role Akun
                      </label>

                      <select
                        className="form-select"
                        value={selectedUser.role}
                        disabled={selectedUserIsCurrentAdmin || actionLoading}
                        onChange={(e) => updateUserRole(e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <small className="text-muted">
                        Status Akun
                      </small>

                      <p className="fw-semibold mb-0">
                        {selectedUser.isActive === false
                          ? "Inactive"
                          : "Active"}
                      </p>
                    </div>

                    {selectedUserIsCurrentAdmin ? (
                      <div
                        className="alert alert-warning mb-0"
                        style={{
                          borderRadius: "14px",
                        }}
                      >
                        Akun admin yang sedang digunakan tidak bisa diubah.
                      </div>
                    ) : (
                      <div className="d-grid gap-2">
                        <button
                          className={
                            selectedUser.isActive === false
                              ? "btn btn-success"
                              : "btn btn-warning"
                          }
                          disabled={actionLoading}
                          onClick={toggleUserStatus}
                        >
                          {selectedUser.isActive === false
                            ? "Aktifkan Akun"
                            : "Nonaktifkan Akun"}
                        </button>

                        <button
                          className="btn btn-outline-danger"
                          disabled={actionLoading}
                          onClick={deleteUser}
                        >
                          Hapus Akun
                        </button>
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

export default AdminUsers;