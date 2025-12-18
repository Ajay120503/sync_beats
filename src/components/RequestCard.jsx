import api from "../services/api";
import { useState } from "react";
import { FaUser, FaMusic, FaCheck, FaTimes } from "react-icons/fa";

export default function RequestCard({ request, refresh }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    try {
      setLoading(true);

      const url =
        action === "accept"
          ? `/rooms/${request.room._id}/accept/${request.user._id}`
          : `/rooms/${request.room._id}/reject/${request.user._id}`;

      await api.post(url);
      refresh && refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition">
      <div className="card-body p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Notification Info */}
        <div className="flex items-center gap-4 w-full">
          {/* Avatar */}
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10">
              <FaUser />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col">
            <p className="text-sm">
              <span className="font-semibold">{request.user.username}</span>{" "}
              wants to join
            </p>
            <p className="text-xs text-base-content/60 flex items-center gap-1">
              <FaMusic className="text-[10px]" />
              {request.room.name}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleAction("accept")}
            disabled={loading}
            className="btn btn-success btn-sm gap-1"
          >
            <FaCheck />
            Accept
          </button>

          <button
            onClick={() => handleAction("reject")}
            disabled={loading}
            className="btn btn-outline btn-error btn-sm gap-1"
          >
            <FaTimes />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
