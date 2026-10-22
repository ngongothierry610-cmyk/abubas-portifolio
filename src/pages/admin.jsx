import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getThumb } from "../useProjects";
import { CATEGORIES } from "../categories";

// Accepts a full YouTube link or just the 11-character ID
function extractYoutubeId(input) {
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
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [link, setLink] = useState("");
  const [featured, setFeatured] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");

    const youtubeId = extractYoutubeId(link);
    if (!youtubeId) {
      setMessage("That doesn't look like a valid YouTube link.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .insert({ title: title.trim(), category, youtube_id: youtubeId, featured });
    setSaving(false);

    if (error) {
      setMessage("Could not add project: " + error.message);
      return;
    }
    setTitle("");
    setLink("");
    setFeatured(false);
    setMessage("Project added.");
    reload();
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
            <button className="delete-btn" onClick={() => handleDelete(p)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}