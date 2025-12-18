import { useState } from "react";
import api from "../services/api";
import { FaMusic, FaUser, FaLink, FaPlus } from "react-icons/fa";

export default function AddSongModal({ roomId, refresh }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    document.getElementById("addSongModal").close();
  };

  const submitSong = async () => {
    if (!title || !artist || !url) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);
      await api.post("/songs", {
        title,
        artist,
        url,
        roomId,
      });

      setTitle("");
      setArtist("");
      setUrl("");
      refresh?.();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add song");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="addSongModal" className="modal modal-middle">
      <div className="modal-box max-w-lg p-6 rounded-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-primary text-primary-content">
            <FaPlus />
          </div>
          <div>
            <h3 className="font-bold text-xl">Add New Song</h3>
            <p className="text-sm text-base-content/60">
              Share music with everyone in the room
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Song Title */}
          <label className="form-control">
            <span className="label-text mb-1">Song Title</span>
            <div className="relative">
              <FaMusic className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Tum Hi Ho"
                className="input input-bordered w-full pl-10"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </label>

          {/* Artist */}
          <label className="form-control">
            <span className="label-text mb-1">Artist</span>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Arigit Singh"
                className="input input-bordered w-full pl-10"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>
          </label>

          {/* URL */}
          <label className="form-control">
            <span className="label-text mb-1">Audio URL</span>
            <div className="relative">
              <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="url"
                placeholder="https://example.com/song.mp3"
                className="input input-bordered w-full pl-10"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <span className="text-xs text-base-content/50 mt-1">
              Must be a direct audio (.mp3) URL
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="modal-action mt-6 flex justify-between">
          <button className="btn btn-ghost" onClick={closeModal}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={submitSong}
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {loading ? "Adding..." : "Add Song"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
