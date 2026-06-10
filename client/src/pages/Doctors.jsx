import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DoctorCard from "../components/DoctorCard";

function Doctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    getDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, search, specialization]);

  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  };

  const getDoctors = async () => {
    try {
      const res = await api.get("/doctors/all");

      const data = res.data.doctors || [];

      const sortedData = data.sort((a, b) => {
        return a.fullName.localeCompare(b.fullName);
      });

      setDoctors(sortedData);
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
          doctor.schedule?.toLowerCase().includes(keyword)
        );
      });
    }

    if (specialization !== "") {
      result = result.filter(
        (doctor) => doctor.specialization === specialization
      );
    }

    setFilteredDoctors(result);
  };

  const goBackDashboard = () => {
    const user = getUserFromStorage();

    if (user?.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (user?.role === "doctor") {
      navigate("/doctor/dashboard");
      return;
    }

    if (user?.role === "user") {
      navigate("/dashboard");
      return;
    }

    navigate("/");
  };

  const specializationOptions = [
    ...new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean)),
  ];

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
              Daftar Dokter
            </h2>

            <p className="text-muted mb-0">
              Pilih dokter sesuai kebutuhan konsultasi Anda
            </p>
          </div>

          <button
            className="btn btn-outline-secondary"
            onClick={goBackDashboard}
          >
            Kembali
          </button>
        </div>

        {/* CONTENT */}
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
                  Dokter Tersedia
                </h5>

                <p className="text-muted mb-0">
                  {filteredDoctors.length} dari {doctors.length} dokter ditampilkan
                </p>
              </div>
            </div>

            {/* FILTER */}
            <div className="row mb-4">
              <div className="col-md-8 mb-3 mb-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama dokter, spesialisasi, alamat, atau jadwal..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">Semua Spesialisasi</option>

                  {specializationOptions.map((item, index) => (
                    <option
                      key={index}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
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
                <h5 className="fw-bold mb-2">
                  Dokter tidak ditemukan
                </h5>

                <p className="text-muted mb-0">
                  Coba gunakan kata kunci atau filter lain.
                </p>
              </div>
            ) : (
              <div className="row justify-content-center g-3">
                {filteredDoctors.map((doctor) => (
                  <div
                    className="col-auto"
                    key={doctor._id}
                  >
                    <DoctorCard doctor={doctor} />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Doctors;