import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useState } from "react";
import { FaUsers, FaCrown, FaDoorOpen } from "react-icons/fa";

export default function RoomCard({ room, refreshRooms }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Works whether members are populated objects or just ObjectIds
  const isOwner = room.owner?._id === user._id;
  const isMember = room.members?.some(
    (m) => (m._id ? m._id.toString() : m.toString()) === user._id
  );

  const requestJoin = async () => {
    try {
      setLoading(true);
      await api.post(`/rooms/${room._id}/request`);
      alert("Join request sent!");
      refreshRooms(); // refresh so status updates
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all">
      <div className="card-body p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold truncate">{room.name}</h2>
            <p className="text-xs text-base-content/60 mt-1">
              by {room.owner?.username}
            </p>
          </div>
          {isOwner && (
            <span className="badge badge-primary gap-1">
              <FaCrown className="text-xs" /> Owner
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm mt-4 text-base-content/70">
          <FaUsers />
          <span>{room.members?.length || 1} members</span>
        </div>

        <div className="mt-5 flex justify-end">
          {isMember || isOwner ? (
            <Link
              to={`/room/${room._id}`}
              className="btn btn-sm btn-primary gap-2"
            >
              <FaDoorOpen />
              Enter
            </Link>
          ) : (
            <button
              onClick={requestJoin}
              disabled={loading}
              className="btn btn-sm btn-outline btn-primary"
            >
              {loading ? "Requesting..." : "Request Join"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
