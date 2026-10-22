// src/projectsData.js
export const projects = [
  {
    id: 1,
    title: "Featured Music Video",
    category: "Music Video",
    youtubeId: "bgLmXRRGMJU",
    featured: true,
  },
  {
    id: 2,
    title: "Kigali Summit",
    category: "Event Coverage",
    youtubeId: "bgLmXRRGMJU",
    featured: true,
  },
  {
    id: 3,
    title: "Discover Rwanda",
    category: "Tourism / Commercial",
    youtubeId: "bgLmXRRGMJU",
    featured: false,
  },
];

// YouTube video -> player link. Your own file -> use videoSrc: "/videos/name.mp4"
export const getVideoSrc = (p) =>
  p.videoSrc ||
  `https://www.youtube.com/embed/${p.youtubeId}?autoplay=1&rel=0`;

// Thumbnail comes from YouTube automatically, or use your own p.image
export const getThumb = (p) =>
  p.image || `https://img.youtube.com/vi/${p.youtubeId}/hqdefault.jpg`;