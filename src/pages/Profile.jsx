import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { login } = useAuth();
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setProfile({ username: res.data.username, email: res.data.email });
      } catch (err) {
        console.error(err);
        showToast("Failed to fetch profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", {
        ...profile,
        password: password || undefined,
      });
      setProfile({ username: res.data.username, email: res.data.email });
      if (password) setPassword("");
      showToast("Profile updated successfully!", "success");
      login({ user: res.data, token: localStorage.getItem("token") });
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to update profile",
        "error"
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="h-max-screen m-5 flex items-center justify-center bg-base-200">
      {/* Toast */}
      {toast.show && (
        <div
          className={`toast z-20 toast-end fixed top-5 right-5 ${
            toast.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          <div className="alert shadow-lg">
            <div className="flex items-center gap-2">
              {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
              <span>{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          My Profile
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username */}
          <div className="form-control">
            <label className="label flex items-center gap-2">
              <FaUser className="text-gray-400" />
              <span className="label-text font-semibold">Username</span>
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label flex items-center gap-2">
              <FaEnvelope className="text-gray-400" />
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label flex items-center gap-2">
              <FaLock className="text-gray-400" />
              <span className="label-text font-semibold">
                Password (optional)
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="input input-bordered input-primary w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary mt-2 ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
