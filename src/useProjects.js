import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Supabase error:", error);
        else setProjects(data);
        setLoading(false);
      });
  }, []);

  return { projects, loading };
}

export const getVideoSrc = (p) =>
  p.video_url ||
  `https://www.youtube.com/embed/${p.youtube_id}?autoplay=1&rel=0`;

export const getThumb = (p) =>
  p.image_url || `https://img.youtube.com/vi/${p.youtube_id}/hqdefault.jpg`;
  