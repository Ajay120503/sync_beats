import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RoomList from "./pages/RoomList";
import RoomDashboard from "./pages/RoomDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import MyPlaylist from "./pages/MyPlaylist";
import JoinRequests from "./pages/JoinRequests";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {/* Navbar */}
      {/* {user && <Navbar />} */}
      <Navbar />

      {/* Main Content */}
      <div
        className={`pt-16 ${
          user ? "pb-24 md:pb-28" : ""
        } min-h-screen bg-base-200`}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/rooms"
            element={user ? <RoomList /> : <Navigate to="/login" />}
          />
          <Route
            path="/room/:id"
            element={user ? <RoomDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-playlist"
            element={user ? <MyPlaylist /> : <Navigate to="/login" />}
          />
          <Route
            path="/join-requests"
            element={user ? <JoinRequests /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
