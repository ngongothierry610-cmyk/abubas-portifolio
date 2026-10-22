export default function VideoModal({ videoUrl, onClose }) {
  if (!videoUrl) return null;

  const isFile = /\.(mp4|webm|ogg)$/i.test(videoUrl);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="video-container">
          {isFile ? (
            <video src={videoUrl} controls autoPlay />
          ) : (
            <iframe
              src={videoUrl}
              title="Video player"
              frameBorder="0"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}