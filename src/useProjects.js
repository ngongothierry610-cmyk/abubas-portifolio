import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
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

export const getThumb = (p) => {
  if (p.image_url) return p.image_url;

  if (p.youtube_id && p.youtube_id.trim() !== "") {
    // Start with 720p HD quality
    return `https://i.ytimg.com/vi/${p.youtube_id.trim()}/hq720.jpg`;
  }

  return "/logo.png";
};