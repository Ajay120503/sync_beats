import { useEffect, useState } from "react";
import api from "../services/api";
import { FaUsers, FaChartBar, FaUserShield, FaMusic } from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaChartBar className="text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Platform analytics & user management
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FaUsers />} label="Total Users" value={stats.users} />
        <StatCard icon={<FaMusic />} label="Total Rooms" value={stats.rooms} />
        <StatCard
          icon={<FaUserShield />}
          label="Admins"
          value={users.filter((u) => u.role === "admin").length}
        />
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 border-base-300 border shadow-lg">
        <div className="card-body p-0">
          <div className="p-5 border-b border-base-300 flex items-center gap-3">
            <FaUsers className="text-primary" />
            <h2 className="text-xl font-semibold">Registered Users</h2>
          </div>

          <div className="overflow-x-auto max-h-125">
            <table className="table table-zebra table-pin-rows">
              <thead className="bg-base-200">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>

                    {/* Avatar + Username */}
                    <td>
                      <div className="flex items-center gap-3">
                        {/* <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-9">
                            <span className="text-sm uppercase">
                              {user.username[0]}
                            </span>
                          </div>
                        </div> */}
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>

                    <td className="text-sm">{user.email}</td>

                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "badge-primary"
                            : "badge-ghost"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="text-sm text-base-content/70">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="p-6 text-center text-base-content/60">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ STAT CARD ------------------ */
function StatCard({ icon, label, value }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow hover:shadow-xl transition">
      <div className="card-body flex-row items-center gap-4">
        <div className="text-3xl text-primary">{icon}</div>
        <div>
          <p className="text-sm text-base-content/60">{label}</p>
          <p className="text-2xl font-bold">{value ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
