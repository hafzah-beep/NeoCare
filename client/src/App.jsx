import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import ApplyDoctor from "./pages/ApplyDoctor";
import BookAppointment from "./pages/BookAppointment";
import AppointmentHistory from "./pages/AppointmentHistory";
import Notifications from "./pages/Notifications";
import DoctorAppointments from "./pages/DoctorAppointments";
import AdminDoctors from "./pages/AdminDoctors";
import AdminUsers from "./pages/AdminUsers";
import AdminAppointments from "./pages/AdminAppointments";
import NotFound from "./pages/NotFound";
import DoctorProfile from "./pages/DoctorProfile";

// Dashboards
import UserDashboard from "./dashboard/UserDashboard";
import DoctorDashboard from "./dashboard/DoctorDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/doctors"
          element={<Doctors />}
        />

        <Route
          path="/doctor/:id"
          element={<DoctorDetail />}
        />

        {/* USER ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
                <UserDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:doctorId"
          element={
            <ProtectedRoute>
              <RoleRoute role="user">
              <BookAppointment />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

        {/* APPLY DOCTOR */}

        <Route
          path="/apply-doctor"
          element={
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />

        {/* DOCTOR ROUTES */}

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="doctor">
                <DoctorDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute>
              <RoleRoute role="doctor">
                <DoctorProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <RoleRoute role="doctor">
                <DoctorAppointments />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDoctors />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminUsers />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminAppointments />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;