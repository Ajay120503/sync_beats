import { useEffect, useState } from "react";
import api from "../services/api";
import RoomCard from "../components/RoomCard";
import { FaMusic, FaPlus } from "react-icons/fa";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/rooms");
      setRooms(res.data); // members populated
    } catch (err) {
      console.error(err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async () => {
    if (!roomName.trim()) return alert("Room name required");
    try {
      await api.post("/rooms", { name: roomName });
      setRoomName("");
      fetchRooms();
      document.getElementById("createRoomModal").close();
      alert("Room created!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create room");
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaMusic className="text-primary" />
            Music Rooms
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Create or join a shared music experience
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm flex items-center gap-2"
          onClick={() => document.getElementById("createRoomModal").showModal()}
        >
          <FaPlus />
          Create Room
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-xl text-center bg-base-100">
          <FaMusic className="text-4xl text-base-content/40 mb-4" />
          <p className="text-lg font-semibold">No rooms available</p>
          <p className="text-sm text-base-content/60 mt-1">
            Create your first room and start streaming together
          </p>
        </div>
      )}

      {!loading && rooms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} refreshRooms={fetchRooms} />
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      <dialog id="createRoomModal" className="modal">
        <div className="modal-box">
          <h3 className="text-xl font-bold mb-2">Create New Room</h3>
          <p className="text-sm text-base-content/60 mb-4">
            Give your room a name others can recognize
          </p>

          <input
            type="text"
            placeholder="Enter room name"
            className="input input-bordered w-full"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <div className="modal-action">
            <button className="btn btn-primary" onClick={createRoom}>
              Create
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => document.getElementById("createRoomModal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
