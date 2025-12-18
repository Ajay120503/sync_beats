import { Link } from "react-router-dom";
import { FaHeadphonesAlt, FaListUl, FaUserShield } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to <span className="text-primary">SyncBeats</span>
        </h1>
        <p className="text-base-content/70 mt-2 max-w-xl">
          Create rooms, sync music in real-time, and collaborate seamlessly with
          your friends.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rooms */}
        <Link
          to="/rooms"
          className="card bg-base-100 border border-base-300 hover:shadow-xl transition-all"
        >
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <FaHeadphonesAlt className="text-primary text-2xl" />
              </div>
              <h2 className="card-title">Rooms</h2>
            </div>

            <p className="text-base-content/70 mt-2">
              Join or create rooms and listen together in perfect sync.
            </p>

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-sm btn-primary">Open Rooms</button>
            </div>
          </div>
        </Link>

        {/* Playlist */}
        <Link
          to="/my-playlist"
          className="card bg-base-100 border border-base-300 hover:shadow-xl transition-all"
        >
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <FaListUl className="text-secondary text-2xl" />
              </div>
              <h2 className="card-title">My Playlist</h2>
            </div>

            <p className="text-base-content/70 mt-2">
              Manage your personal music collection across rooms.
            </p>

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-sm btn-secondary">
                View Playlist
              </button>
            </div>
          </div>
        </Link>

        {/* Admin (Only if admin) */}
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="card bg-base-100 border border-base-300 hover:shadow-xl transition-all"
          >
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <FaUserShield className="text-warning text-2xl" />
                </div>
                <h2 className="card-title">Admin Panel</h2>
              </div>

              <p className="text-base-content/70 mt-2">
                Control users, rooms, and platform-level settings.
              </p>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-warning">Open Admin</button>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
