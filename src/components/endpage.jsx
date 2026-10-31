import { FaEnvelope, FaPhone, FaWhatsapp, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
export default function Endpage() {
  return (
    <section className="endpage-section" id="contact">
      {/* Full-width top thank-you header */}
      <div className="endpage-header">
        <h2>Thank you for visiting our portfolio!</h2>
        <p>We hope you found what you were looking for. Feel free to reach out if you have any questions or would like to collaborate.</p>
      </div>

      {/* 3 Structural Columns */}
      <div className="endpage-columns">
        <div className="footer-col">
          <h3>Services</h3>
          <div className="col-links">
            <span>Video Production</span>
            <span>Video Editing</span>
            <span>Event Coverage</span>
            <span>Marketing & Social Media Management</span>
          </div>
        </div>

       <div className="footer-col">
          <h3>Contacts</h3>
          <div className="col-links">
            <a href="mailto:ngongothierry610@gmail.com"><FaEnvelope /> Email</a>
            <a href="tel:+250789696300"><FaPhone /> Phone</a>
            <a href="https://wa.me/250789696300" target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Social Media</h3>
          <div className="col-links">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><FaFacebook /> Facebook</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="endpage-bottom-bar" style={{ textAlign: "center", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #222", color: "#888", fontSize: "0.85rem" }}>
        <p>© 2026 Visual <span style={{ color: "#e50914" }}>Arts</span> all rights reserved.</p>
      </div>
    </section>
  );
}