import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function JoinRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Show toast
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      3000
    );
  };

  // Fetch all join requests for rooms owned by the admin
  const fetchRequests = async () => {
    try {
      const res = await api.get("/rooms");
      const ownedRooms = res.data.filter(
        (room) => room.owner?._id === user?._id
      );

      const pendingRequests = [];
      for (const room of ownedRooms) {
        const roomDetails = await api.get(`/rooms/${room._id}`);
        roomDetails.data.requests.forEach((reqUser) => {
          pendingRequests.push({
            roomId: room._id,
            roomName: room.name,
            userId: reqUser._id,
            username: reqUser.username,
          });
        });
      }

      setRequests(pendingRequests);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch join requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Accept or reject a request
  const handleAction = async (roomId, userId, action) => {
    try {
      await api.post(`/rooms/${roomId}/${action}/${userId}`);
      showToast(
        `Request ${action === "accept" ? "accepted" : "rejected"}!`,
        action === "accept" ? "success" : "error"
      );

      // Re-fetch join requests after action
      fetchRequests();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Action failed", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (requests.length === 0)
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        No pending join requests 🎉
      </div>
    );

  return (
    <div className="p-4 md:p-6  mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">🔔 Join Requests</h1>

      {/* Toast */}
      {toast.show && (
        <div
          className={`alert ${
            toast.type === "success" ? "alert-success" : "alert-error"
          } fixed top-4 right-4 z-50 shadow-lg`}
        >
          {toast.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((req, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition"
          >
            <div className="card-body flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg">{req.username}</h3>
                <p className="text-sm text-gray-500">
                  Wants to join{" "}
                  <span className="font-semibold">{req.roomName}</span>
                </p>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleAction(req.roomId, req.userId, "accept")}
                >
                  Accept
                </button>

                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleAction(req.roomId, req.userId, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
