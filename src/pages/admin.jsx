import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getThumb } from "../useProjects";
import { CATEGORIES } from "../categories";

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
  const [activeTab, setActiveTab] = useState("projects"); // "projects" | "logos" | "gallery"
  
  // Data lists
  const [projects, setProjects] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // Search & Filter (Projects)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Global status message
  const [message, setMessage] = useState("");

  // Form states: Projects
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [link, setLink] = useState("");
  const [thumbChoice, setThumbChoice] = useState("youtube");
  const [imageFile, setImageFile] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  // Form states: Client Logos
  const [clientName, setClientName] = useState("");
  const [clientFile, setClientFile] = useState(null);
  const [savingLogo, setSavingLogo] = useState(false);

  // Form states: Gallery
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryFile, setGalleryFile] = useState(null);
  const [savingGallery, setSavingGallery] = useState(false);

  // Edit states (Projects)
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
      .then(({ data }) => {
        if (data) setProjects(data);
      });

    supabase
      .from("client_logos")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setClientLogos(data);
      });

    supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setGalleryImages(data);
      });
  }, [refresh]);

  const reload = () => setRefresh((r) => r + 1);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const uploadFileToSupabase = async (file, folder = "project-images") => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /* --- HANDLERS: PROJECTS --- */
  const handleAddProject = async (e) => {
    e.preventDefault();
    setMessage("");

    const youtubeId = extractYoutubeId(link);
    if (!youtubeId) {
      setMessage("Invalid YouTube link.");
      return;
    }

    if (thumbChoice === "custom" && !imageFile) {
      setMessage("Please choose a custom image file.");
      return;
    }

    setSavingProject(true);
    try {
      let imageUrl = null;
      if (thumbChoice === "custom" && imageFile) {
        imageUrl = await uploadFileToSupabase(imageFile, "project-images");
      }

      const { error } = await supabase.from("projects").insert({
        title: title.trim(),
        category,
        youtube_id: youtubeId,
        image_url: imageUrl,
        featured,
      });

      if (error) throw error;

      setTitle("");
      setLink("");
      setImageFile(null);
      setThumbChoice("youtube");
      setFeatured(false);
      setMessage("Project published successfully!");
      reload();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSavingProject(false);
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

  const handleUpdateProject = async (project) => {
    setMessage("");
    const youtubeId = extractYoutubeId(editLink);
    if (!youtubeId) {
      setMessage("Invalid YouTube link.");
      return;
    }

    setSavingProject(true);
    try {
      let imageUrl = project.image_url;
      if (editThumbChoice === "custom") {
        if (editImageFile) {
          imageUrl = await uploadFileToSupabase(editImageFile, "project-images");
        }
      } else {
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

      setMessage("Project updated!");
      setEditingId(null);
      reload();
    } catch (err) {
      setMessage("Update error: " + err.message);
    } finally {
      setSavingProject(false);
    }
  };

  const toggleFeatured = async (project) => {
    await supabase.from("projects").update({ featured: !project.featured }).eq("id", project.id);
    reload();
  };

  const handleDeleteProject = async (p) => {
    if (!window.confirm(`Delete project "${p.title}"?`)) return;
    await supabase.from("projects").delete().eq("id", p.id);
    reload();
  };

  /* --- HANDLERS: LOGOS --- */
  const handleAddLogo = async (e) => {
    e.preventDefault();
    if (!clientName || !clientFile) {
      setMessage("Provide client name and logo file.");
      return;
    }

    setSavingLogo(true);
    try {
      const logoUrl = await uploadFileToSupabase(clientFile, "client-logos");
      const { error } = await supabase.from("client_logos").insert({
        name: clientName.trim(),
        logo_url: logoUrl,
      });

      if (error) throw error;

      setClientName("");
      setClientFile(null);
      setMessage("Client logo added successfully!");
      reload();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSavingLogo(false);
    }
  };

  const handleDeleteLogo = async (id, name) => {
    if (!window.confirm(`Delete client logo "${name}"?`)) return;
    await supabase.from("client_logos").delete().eq("id", id);
    reload();
  };

  /* --- HANDLERS: GALLERY --- */
  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!galleryTitle || !galleryFile) {
      setMessage("Provide photo title and image file.");
      return;
    }

    setSavingGallery(true);
    try {
      const imageUrl = await uploadFileToSupabase(galleryFile, "gallery");
      const { error } = await supabase.from("gallery").insert({
        title: galleryTitle.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      setGalleryTitle("");
      setGalleryFile(null);
      setMessage("Gallery photo added successfully!");
      reload();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSavingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (id, title) => {
    if (!window.confirm(`Delete gallery photo "${title}"?`)) return;
    await supabase.from("gallery").delete().eq("id", id);
    reload();
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <header className="admin-top-header">
        <h1>Admin Control Panel</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      {message && <div className="admin-global-message">{message}</div>}

      {/* Structured Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Manage Projects ({projects.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "logos" ? "active" : ""}`}
          onClick={() => setActiveTab("logos")}
        >
          Manage Client Logos ({clientLogos.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          Manage Gallery ({galleryImages.length})
        </button>
      </div>

      {/* TAB 1: PROJECTS */}
      {activeTab === "projects" && (
        <div className="admin-tab-content">
          <div className="admin-dashboard-grid">
            <div className="admin-card">
              <h3>Add New Project</h3>
              <form onSubmit={handleAddProject} className="admin-form-compact">
                <input
                  type="text"
                  placeholder="Project Title"
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
                  placeholder="YouTube Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />

                <div className="thumbnail-picker-box">
                  <label className="picker-label">Thumbnail Source:</label>
                  <div className="radio-row">
                    <label>
                      <input
                        type="radio"
                        name="thumbChoice"
                        checked={thumbChoice === "youtube"}
                        onChange={() => setThumbChoice("youtube")}
                      /> YouTube
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="thumbChoice"
                        checked={thumbChoice === "custom"}
                        onChange={() => setThumbChoice("custom")}
                      /> Custom File
                    </label>
                  </div>
                </div>

                {thumbChoice === "custom" && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                  />
                )}

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  Feature in Hero Slideshow
                </label>

                <button type="submit" className="btn-primary" disabled={savingProject}>
                  {savingProject ? "Publishing..." : "Publish Project"}
                </button>
              </form>
            </div>

            <div className="admin-card">
              <div className="list-header-row">
                <h3>Projects Directory</h3>
                <div className="filter-controls">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-scrollable-list">
                {filteredProjects.map((p) => (
                  <div key={p.id} className="admin-project-card-row">
                    <img src={getThumb(p)} alt={p.title} className="row-thumb" />

                    {editingId === p.id ? (
                      <div className="row-edit-form">
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
                          value={editLink}
                          onChange={(e) => setEditLink(e.target.value)}
                        />
                        <div className="radio-row">
                          <label>
                            <input
                              type="radio"
                              name={`editChoice-${p.id}`}
                              checked={editThumbChoice === "youtube"}
                              onChange={() => setEditThumbChoice("youtube")}
                            /> YT
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`editChoice-${p.id}`}
                              checked={editThumbChoice === "custom"}
                              onChange={() => setEditThumbChoice("custom")}
                            /> Custom
                          </label>
                        </div>
                        {editThumbChoice === "custom" && (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditImageFile(e.target.files[0])}
                          />
                        )}
                        <div className="edit-action-btns">
                          <button className="btn-save-sm" onClick={() => handleUpdateProject(p)}>Save</button>
                          <button className="btn-cancel-sm" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="row-info">
                          <h4>{p.title}</h4>
                          <span className="badge-cat">{p.category}</span>
                        </div>
                        <div className="row-actions">
                          <label className="featured-toggle">
                            <input
                              type="checkbox"
                              checked={p.featured}
                              onChange={() => toggleFeatured(p)}
                            />
                            Featured
                          </label>
                          <button className="btn-edit" onClick={() => startEdit(p)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteProject(p)}>Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT LOGOS */}
      {activeTab === "logos" && (
        <div className="admin-tab-content">
          <div className="admin-dashboard-grid">
            <div className="admin-card">
              <h3>Add Client Logo</h3>
              <form onSubmit={handleAddLogo} className="admin-form-compact">
                <input
                  type="text"
                  placeholder="Client/Company Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setClientFile(e.target.files[0])}
                  required
                />
                <button type="submit" className="btn-primary" disabled={savingLogo}>
                  {savingLogo ? "Uploading..." : "Upload Logo"}
                </button>
              </form>
            </div>

            <div className="admin-card">
              <h3>Client Logos Directory ({clientLogos.length})</h3>
              <div className="admin-scrollable-list">
                {clientLogos.map((logo) => (
                  <div key={logo.id} className="admin-project-card-row">
                    <img src={logo.logo_url} alt={logo.name} className="row-thumb" style={{ background: "#fff", objectFit: "contain" }} />
                    <div className="row-info">
                      <h4>{logo.name}</h4>
                    </div>
                    <div className="row-actions">
                      <button className="btn-delete" onClick={() => handleDeleteLogo(logo.id, logo.name)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GALLERY PHOTOS */}
      {activeTab === "gallery" && (
        <div className="admin-tab-content">
          <div className="admin-dashboard-grid">
            <div className="admin-card">
              <h3>Add Photo to Gallery</h3>
              <form onSubmit={handleAddGalleryImage} className="admin-form-compact">
                <input
                  type="text"
                  placeholder="Photo Title / Description"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryFile(e.target.files[0])}
                  required
                />
                <button type="submit" className="btn-primary" disabled={savingGallery}>
                  {savingGallery ? "Uploading..." : "Upload Photo"}
                </button>
              </form>
            </div>

            <div className="admin-card">
              <h3>Gallery Directory ({galleryImages.length})</h3>
              <div className="admin-scrollable-list">
                {galleryImages.map((img) => (
                  <div key={img.id} className="admin-project-card-row">
                    <img src={img.image_url} alt={img.title} className="row-thumb" style={{ objectFit: "cover" }} />
                    <div className="row-info">
                      <h4>{img.title}</h4>
                    </div>
                    <div className="row-actions">
                      <button className="btn-delete" onClick={() => handleDeleteGalleryImage(img.id, img.title)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}