import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            We at Vet for Your Pet, are committed to providing your pets with
            compassionate and knowledgeable care.
          </p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/vetforyourpet"
              className="social-icon"
            >
              <img
                src="/facebook.png"
                alt="Facebook"
                className="social-image"
              />
            </a>
            <a
              href="https://www.instagram.com/vetforyourpet/"
              className="social-icon"
            >
              <img
                src="/instagram.png"
                alt="Instagram"
                className="social-image"
              />
            </a>
            <a
              href="https://www.youtube.com/@vetforyourpet"
              className="social-icon"
            >
              <img src="/youtube.png" alt="YouTube" className="social-image" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/adopt">Adoption Process</a>
            </li>
            <li>
              <a href="/services">Our Services</a>
            </li>
            <li>
              <a href="/rescue">Rescue Portal</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="footer-links">
            <li>Phone: 01-9893244</li>
            <li>Email: info@pawfinder.com</li>
            <li>Address: Gapali-6, Bhadrapur, Nepal</li>
          </ul>
        </div>

        <div className="footer-section feedback-form">
          <h4>Share your feedback</h4>
          <textarea placeholder="Your feedback..." rows={4}></textarea>
          <button className="submit-feedback">Submit</button>
        </div>
      </div>
    </footer>
  );
}
