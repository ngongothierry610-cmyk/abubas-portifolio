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
            <a href="mailto:ngongothierry610@gmail.com">Email</a>
            <a href="tel:+250789696300">Phone</a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Social Media</h3>
          <div className="col-links">
            <a href="https://www.facebook.com/thierry.ngongo.1" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/thierry_ngongo/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </section>
  );
}