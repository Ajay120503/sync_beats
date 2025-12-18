import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../services/api";
import {
  FaPlay,
  FaTrashAlt,
  FaMusic,
  FaUserPlus,
  FaBroadcastTower,
} from "react-icons/fa";

export default function SongCard({
  song,
  refresh,
  roomId,
  setCurrentSong,
  currentSong,
}) {
  const { user } = useAuth();
  const { socket, isHost } = useSocket();

  const canDelete =
    user?.role === "admin" || song.addedBy?._id?.toString() === user?._id;

  const deleteSong = async () => {
    if (!confirm("Remove this song from the playlist?")) return;
    try {
      await api.delete(`/songs/${song._id}`);
      refresh && refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove song");
    }
  };

  const playSong = () => {
    if (!roomId || !socket || !user) return;

    if (isHost) {
      setCurrentSong(song);
      socket.emit("play-song", { roomId, song, currentTime: 0 });
    } else {
      socket.emit("request-play", {
        roomId,
        song,
        requestedBy: { _id: user._id, username: user.username },
      });
    }
  };

  const isPlaying = currentSong?._id === song._id;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition relative">
      {/* Badge for currently playing song */}
      {isPlaying && (
        <span className="absolute top-2 right-2 badge badge-sm badge-primary flex items-center gap-1">
          <FaBroadcastTower className="w-3 h-3" /> Playing
        </span>
      )}

      <div className="card-body p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FaMusic />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base truncate">{song.title}</h3>
            <p className="text-sm text-base-content/60 truncate">
              {song.artist}
            </p>
            {song.addedBy && (
              <p className="text-xs text-base-content/50 mt-1">
                Added by{" "}
                <span className="font-medium">{song.addedBy.username}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={playSong}
            className={`btn btn-xs h-8 rounded-full flex items-center justify-center ${
              isHost ? "btn-outline btn-primary" : "btn-outline btn-success"
            }`}
          >
            {isHost ? (
              <FaPlay className="size-4" />
            ) : (
              <FaUserPlus className="size-4" />
            )}
          </button>

          {canDelete && (
            <button
              onClick={deleteSong}
              className="btn btn-sm btn-ghost text-error flex items-center gap-2"
            >
              <FaTrashAlt /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
