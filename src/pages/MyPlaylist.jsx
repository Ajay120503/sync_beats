import { useEffect, useState } from "react";
import SongCard from "../components/SongCard";
import AddSongModal from "../components/AddSongModal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MyPlaylist() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    if (!user?._id) return; // wait until user exists
    try {
      setLoading(true);
      const res = await api.get(`/songs/user/${user._id}`);
      setSongs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [user?._id]);

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500">Loading user info...</div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🎵 My Playlist</h2>
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById("addSongModal").showModal()}
        >
          + Add Song
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Empty Playlist */}
      {!loading && songs.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p>No songs in your playlist yet 🎧</p>
          <p>Add some songs to start listening!</p>
        </div>
      )}

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} refresh={fetchSongs} />
        ))}
      </div>

      {/* Add Song Modal */}
      <AddSongModal roomId={null} refresh={fetchSongs} />
    </div>
  );
}
