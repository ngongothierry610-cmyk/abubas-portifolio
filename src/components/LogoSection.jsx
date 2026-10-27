// src/components/LogoSection.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function LogoSection() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    supabase
      .from("client_logos")
      .select("*")
      .order("order_index", { ascending: true }) // Sorts by your custom order
      .then(({ data, error }) => {
        if (!error && data) {
          setLogos(data);
        }
      });
  }, []);

  if (logos.length === 0) return null;

  return (
    <section className="logo-section">
      <div className="logo-container">
        <h2 className="logo-section-title">FEATURED BRANDS & PARTNERS</h2>
        <div className="logos-grid">
          {logos.map((logo) => (
            <div className="logo-card" key={logo.id}>
              <img src={logo.logo_url} alt={logo.name} title={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}