import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import SongCard from "../components/SongCard";
import AddSongModal from "../components/AddSongModal";
import { useAuth } from "../context/AuthContext";
import AudioPlayer from "../components/AudioPlayer";
import { FaMusic, FaPlus, FaUserShield } from "react-icons/fa";
import { useSocket } from "../context/SocketContext";

export default function RoomDashboard() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [songs, setSongs] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSong, setCurrentSong] = useState(null);

  const fetchRoom = async () => {
    try {
      const res = await api.get(`/rooms/${id}`);
      setRoom(res.data);
    } catch {
      setError("Room not found");
      setRoom(null);
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await api.get(`/songs/room/${id}`);
      setSongs(res.data);
    } catch {
      setSongs([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchRoom();
      await fetchSongs();
      setLoading(false);
    };
    loadData();
  }, [id]);

  const isOwner = user?.role === "admin" || room?.owner?._id === user?._id;

  // ---------------- SOCKET LISTENERS ----------------
  useEffect(() => {
    if (!socket || !user) return;

    // Member: handle host response to play requests
    const handleRequestResponse = ({ accepted, song, userId }) => {
      if (userId === user._id) {
        if (accepted) setCurrentSong(song);
      }
    };

    // Member: receive current room state when joining (sync playback)
    const handleSyncState = (state) => {
      if (state?.song) {
        setCurrentSong(state.song); // ensures UI sync & "Playing" badge
      }
    };

    socket.on("request-play-response", handleRequestResponse);
    socket.on("sync-state", handleSyncState);

    return () => {
      socket.off("request-play-response", handleRequestResponse);
      socket.off("sync-state", handleSyncState);
    };
  }, [socket, user.id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-error">{error}</h2>
        <button
          className="btn btn-primary mt-6"
          onClick={() => navigate("/rooms")}
        >
          Back to Rooms
        </button>
      </div>
    );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FaMusic className="text-primary" /> {room?.name}
          </h2>
          <p className="text-base-content/70 text-sm mt-1">
            {songs.length} songs in playlist
          </p>
        </div>

        {isOwner && (
          <div className="flex items-center gap-3">
            <span className="badge badge-outline badge-primary flex items-center gap-1">
              <FaUserShield /> Owner
            </span>
            <button
              className="btn btn-primary btn-sm flex items-center gap-2"
              onClick={() =>
                document.getElementById("addSongModal").showModal()
              }
            >
              <FaPlus /> Add Song
            </button>
          </div>
        )}
      </div>

      {/* Songs Grid / Empty */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-base-100 border border-dashed rounded-xl">
          <FaMusic className="text-4xl text-base-content/40 mb-4" />
          <p className="text-lg font-semibold">No songs yet</p>
          <p className="text-base-content/60 text-sm mt-1">
            Start building the playlist for this room
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              refresh={fetchSongs}
              roomId={id}
              setCurrentSong={setCurrentSong}
              currentSong={currentSong}
            />
          ))}
        </div>
      )}

      {/* Player */}
      <div className="mt-10">
        <AudioPlayer
          roomId={id}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
        />
      </div>

      {/* Add Song Modal */}
      <AddSongModal roomId={id} refresh={fetchSongs} />
    </div>
  );
}
