import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setImages(data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="gallery-page-container" style={{ padding: "100px 5%", minHeight: "80vh", color: "#fff" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#e50914" }}>Photo Gallery</h1>
      <p style={{ color: "#aaa", marginBottom: "40px" }}>A showcase of moments, behind-the-scenes, and stills.</p>

      {loading ? (
        <p style={{ color: "#666" }}>Loading gallery...</p>
      ) : images.length === 0 ? (
        <p style={{ color: "#666" }}>No photos uploaded yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {images.map((img) => (
            <div 
              key={img.id} 
              style={{ overflow: "hidden", borderRadius: "8px", background: "#111", cursor: "pointer", border: "1px solid #222" }}
              onClick={() => setSelectedImg(img)}
            >
              <img 
                src={img.image_url} 
                alt={img.title} 
                style={{ width: "100%", height: "220px", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
              />
              <div style={{ padding: "12px", background: "#141414" }}>
                <h4 style={{ margin: 0, fontSize: "1rem", color: "#eee" }}>{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImg && (
        <div 
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
          onClick={() => setSelectedImg(null)}
        >
          <div style={{ position: "relative", maxWidth: "900px", width: "100%", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImg.image_url} alt={selectedImg.title} style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }} />
            <h3 style={{ marginTop: "15px", color: "#fff" }}>{selectedImg.title}</h3>
            <button 
              onClick={() => setSelectedImg(null)}
              style={{ position: "absolute", top: "-40px", right: "0", background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer" }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}