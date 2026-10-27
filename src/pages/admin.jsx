import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getThumb } from "../useProjects";
import { CATEGORIES } from "../categories";

// Accepts a full YouTube link or just the 11-character ID
function extractYoutubeId(input) {
  if (!input) return null;
  const s = input.trim();
  const m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return null;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // Form states (YouTube link is always required)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [link, setLink] = useState("");
  const [thumbChoice, setThumbChoice] = useState("youtube"); // "youtube" | "custom"
  const [imageFile, setImageFile] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
  const [editLink, setEditLink] = useState("");
  const [editThumbChoice, setEditThumbChoice] = useState("youtube");
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setMessage("Could not load projects: " + error.message);
        else setProjects(data);
      });
  }, [refresh]);

  const reload = () => setRefresh((r) => r + 1);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const uploadFileToSupabase = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `project-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");

    const youtubeId = extractYoutubeId(link);
    if (!youtubeId) {
      setMessage("That doesn't look like a valid YouTube link.");
      return;
    }

    if (thumbChoice === "custom" && !imageFile) {
      setMessage("Please select a custom image file to upload.");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = null;
      if (thumbChoice === "custom" && imageFile) {
        imageUrl = await uploadFileToSupabase(imageFile);
      }

      const { error } = await supabase.from("projects").insert({
        title: title.trim(),
        category,
        youtube_id: youtubeId,
        image_url: imageUrl, // null if using YouTube thumbnail, string URL if custom uploaded
        featured,
      });

      if (error) throw error;

      setTitle("");
      setLink("");
      setImageFile(null);
      setThumbChoice("youtube");
      setFeatured(false);
      setMessage("Project added successfully.");
      reload();
    } catch (err) {
      setMessage("Could not add project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditCategory(p.category);
    setEditLink(p.youtube_id ? `https://youtu.be/${p.youtube_id}` : "");
    setEditThumbChoice(p.image_url ? "custom" : "youtube");
    setEditImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageFile(null);
  };

  const handleUpdate = async (project) => {
    setMessage("");

    const youtubeId = extractYoutubeId(editLink);
    if (!youtubeId) {
      setMessage("Invalid YouTube link.");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = project.image_url;

      if (editThumbChoice === "custom") {
        if (editImageFile) {
          imageUrl = await uploadFileToSupabase(editImageFile);
        }
      } else {
        // If switched back to YouTube thumbnail, clear out custom image_url
        imageUrl = null;
      }

      const { error } = await supabase
        .from("projects")
        .update({
          title: editTitle.trim(),
          category: editCategory,
          youtube_id: youtubeId,
          image_url: imageUrl,
        })
        .eq("id", project.id);

      if (error) throw error;

      setMessage("Project updated.");
      setEditingId(null);
      reload();
    } catch (err) {
      setMessage("Could not update project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (project) => {
    const { error } = await supabase
      .from("projects")
      .update({ featured: !project.featured })
      .eq("id", project.id);
    if (error) setMessage("Could not update: " + error.message);
    else reload();
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) setMessage("Could not delete: " + error.message);
    else reload();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h2 className="admin-heading">Add a project</h2>
      <form className="admin-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="YouTube link (https://youtu.be/...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />

        <div className="thumbnail-source-selector">
          <label>Thumbnail Source:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="thumbChoice"
                value="youtube"
                checked={thumbChoice === "youtube"}
                onChange={() => setThumbChoice("youtube")}
              />
              Use YouTube Thumbnail
            </label>
            <label>
              <input
                type="radio"
                name="thumbChoice"
                value="custom"
                checked={thumbChoice === "custom"}
                onChange={() => setThumbChoice("custom")}
              />
              Upload Custom Image
            </label>
          </div>
        </div>

        {thumbChoice === "custom" && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required={!imageFile}
          />
        )}

        <label className="admin-check">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Show on home page (featured)
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Project"}
        </button>
      </form>

      {message && <p className="admin-message">{message}</p>}

      <h2 className="admin-heading">Your projects ({projects.length})</h2>
      <div className="admin-list">
        {projects.map((p) => (
          <div key={p.id} className="admin-row">
            <img src={getThumb(p)} alt={p.title} />

            {editingId === p.id ? (
              <div className="admin-row-edit">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="YouTube link"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  required
                />

                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name={`editThumbChoice-${p.id}`}
                      value="youtube"
                      checked={editThumbChoice === "youtube"}
                      onChange={() => setEditThumbChoice("youtube")}
                    />
                    YouTube Thumb
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`editThumbChoice-${p.id}`}
                      value="custom"
                      checked={editThumbChoice === "custom"}
                      onChange={() => setEditThumbChoice("custom")}
                    />
                    Upload Image
                  </label>
                </div>

                {editThumbChoice === "custom" && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImageFile(e.target.files[0])}
                  />
                )}

                <button
                  className="save-btn"
                  onClick={() => handleUpdate(p)}
                  disabled={saving}
                >
                  Save
                </button>
                <button className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="admin-row-info">
                  <strong>{p.title}</strong>
                  <span>{p.category}</span>
                </div>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={() => toggleFeatured(p)}
                  />
                  Featured
                </label>
                <button className="edit-btn" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(p)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}