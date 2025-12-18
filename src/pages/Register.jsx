import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const submit = async () => {
    const { username, email, password } = form;

    if (!username || !email || !password) {
      showToast("error", "All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", form);
      showToast("success", "Account created successfully");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <h2 className="text-3xl font-bold text-center mb-2">
            Create Account 🎶
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-6">
            Join and start collaborating with music rooms
          </p>

          {/* Username */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                className="input input-bordered w-full pl-10"
                type="text"
                placeholder="Your name"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                className="input input-bordered w-full pl-10"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                className="input input-bordered w-full pl-10"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            className={`btn btn-success w-full gap-2 ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
          >
            {!loading && <FaUserPlus />}
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Footer */}
          <p className="text-sm text-center mt-6 text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
