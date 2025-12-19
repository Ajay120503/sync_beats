import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { FaPlay, FaPause, FaMusic, FaUserShield } from "react-icons/fa";

export default function AudioPlayer({ roomId, currentSong, setCurrentSong }) {
  const audioRef = useRef(null);
  const { socket, isHost } = useSocket();
  const { user } = useAuth();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [syncedSong, setSyncedSong] = useState(null);
  const [incomingRequest, setIncomingRequest] = useState(null);

  const songToRender = currentSong || syncedSong;

  const safePlay = async (audioEl) => {
    try {
      const result = audioEl.play();
      if (result?.catch) result.catch(() => {});
    } catch {}
  };

  // Join room
  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("join-room", { roomId, userId: user._id });
  }, [socket, user, roomId]);

  // Sync state for all members
  useEffect(() => {
    if (!socket) return;

    const handler = ({ song, currentTime, isPlaying }) => {
      if (!audioRef.current || !song) return;

      const audioEl = audioRef.current;

      if (!isHost) {
        setSyncedSong(song);

        if (audioEl.src !== song.url) audioEl.src = song.url;

        if (!isNaN(currentTime)) audioEl.currentTime = currentTime;

        if (isPlaying) safePlay(audioEl);
        else audioEl.pause();
      }

      setIsPlaying(isPlaying);
      setProgress(
        ((currentTime || 0) / (audioRef.current.duration || 1)) * 100
      );
    };

    socket.on("sync-state", handler);
    return () => socket.off("sync-state", handler);
  }, [socket, isHost]);

  // Incoming play request (host sees modal)
  useEffect(() => {
    if (!socket || !isHost) return;

    // Inside sync-state handler:
    const handler = ({ song, currentTime, isPlaying }) => {
      if (!audioRef.current || !song) return;

      const audioEl = audioRef.current;

      // Update currentSong for UI
      setCurrentSong(song);

      if (audioEl.src !== song.url) audioEl.src = song.url;

      if (!isNaN(currentTime)) audioEl.currentTime = currentTime;

      if (isPlaying) safePlay(audioEl);
      else audioEl.pause();

      setIsPlaying(isPlaying);
      setProgress(((currentTime || 0) / (audioEl.duration || 1)) * 100);
    };

    socket.on("incoming-play-request", handler);
    return () => socket.off("incoming-play-request", handler);
  }, [socket, isHost]);

  // Handle host accept/reject
  const handleRequestResponse = (accepted) => {
    if (!incomingRequest) return;

    const { song, requestedBySocket } = incomingRequest;

    socket.emit("respond-play-request", {
      roomId,
      song,
      requestedBySocket,
      accepted,
    });

    if (accepted && isHost) {
      setCurrentSong(song);

      // HOST does NOT play manually; server emits sync-state for all members
      socket.emit("play-song", {
        roomId,
        song,
        currentTime: 0,
      });
    }

    setIncomingRequest(null);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(
      (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100
    );
  };

  const play = async () => {
    if (!isHost || !songToRender || !audioRef.current) return;

    const audioEl = audioRef.current;

    if (audioEl.src !== songToRender.url) {
      audioEl.src = songToRender.url;
      audioEl.currentTime = 0;
    }

    await safePlay(audioEl);
    setIsPlaying(true);

    socket.emit("play-song", {
      roomId,
      song: songToRender,
      currentTime: audioEl.currentTime,
    });
  };

  const pause = () => {
    if (!isHost || !audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);

    socket.emit("pause-song", {
      roomId,
      currentTime: audioRef.current.currentTime,
    });
  };

  const seek = (e) => {
    if (!isHost || !audioRef.current) return;

    const time = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(e.target.value);

    socket.emit("seek-song", { roomId, currentTime: time });
  };

  if (!songToRender) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FaMusic />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">
                {songToRender.title}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {songToRender.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={isHost ? (isPlaying ? pause : play) : null}
              disabled={!isHost}
              className={`btn btn-circle btn-sm btn-primary ${
                !isHost && "opacity-50 cursor-not-allowed"
              }`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            {isHost ? (
              <span className="text-green-600 flex items-center gap-1">
                <FaUserShield /> Host
              </span>
            ) : (
              <span
                className={`flex items-center gap-1 ${
                  isPlaying ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {isPlaying ? <FaPlay /> : <FaPause />} Synced
              </span>
            )}
          </div>

          <div className="hidden md:flex flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={seek}
              disabled={!isHost}
              className="range range-xs range-primary"
            />
          </div>

          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
        </div>
      </div>

      {incomingRequest && isHost && (
        <dialog className="modal modal-open">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Play Request</h3>
            <p className="py-4">
              User{" "}
              <span className="font-medium">
                {incomingRequest.requestedBy?.username || "User"}
              </span>{" "}
              requested to play:{" "}
              <span className="font-medium">{incomingRequest.song.title}</span>
            </p>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleRequestResponse(true)}
              >
                Accept
              </button>

              <button
                type="button"
                className="btn btn-error"
                onClick={() => handleRequestResponse(false)}
              >
                Reject
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}


