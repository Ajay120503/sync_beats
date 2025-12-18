import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const submit = async () => {
    if (!email || !password) {
      showToast("error", "Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      showToast("success", "Login successful");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-base-200 to-base-300 p-4">
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
            Welcome Back 👋
          </h2>
          <p className="text-center text-sm text-base-content/60 mb-6">
            Sign in to continue to your rooms
          </p>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={submit}
            className={`btn btn-primary w-full gap-2 ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
          >
            {!loading && <FaSignInAlt />}
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Footer */}
          <p className="text-sm text-center mt-6 text-base-content/60">
            Don’t have an account?{" "}
            <Link to="/register" className="link link-primary font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
