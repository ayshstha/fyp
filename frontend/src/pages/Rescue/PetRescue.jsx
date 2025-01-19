import React from "react";
import { Heart, PawPrint, Home, Shield } from "lucide-react";
import Rescue from "../../components/Rescue/Rescue";
import "./PetRescue.css";

const PetRescue = () => {
  return (
    <div className="rescue-container">
      <Rescue />

      <section className="rescue-intro">
        <div className="intro-content">
          <h1>Give Hope to Homeless Dogs</h1>
          <p>
            Every dog deserves a chance at happiness. Our rescue mission
            transforms lives, one paw at a time.
          </p>
        </div>
      </section>

      <section className="video-section">
        <h2>See Our Rescue Work</h2>
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/your-video-id"
            title="Dog Rescue Operations"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section className="rescue-info">
        <div className="info-grid">
          <div className="info-card">
            <Heart className="info-icon" />
            <h3>Why They Need Us</h3>
            <p>
              Many dogs face abandonment, abuse, or injuries on the streets.
              Without intervention, these beautiful souls have little chance of
              survival or finding loving homes.
            </p>
          </div>
          <div className="info-card">
            <PawPrint className="info-icon" />
            <h3>Our Rescue Process</h3>
            <p>
              From emergency rescue to rehabilitation, we provide comprehensive
              care including medical treatment, behavioral training, and
              emotional support to prepare dogs for their forever homes.
            </p>
          </div>
          <div className="info-card">
            <Home className="info-icon" />
            <h3>Adoption Journey</h3>
            <p>
              We carefully match dogs with loving families, ensuring both the
              dog and adopter are set up for a successful, lifelong bond. Each
              adoption includes support and guidance.
            </p>
          </div>
          <div className="info-card">
            <Shield className="info-icon" />
            <h3>Post-Adoption Care</h3>
            <p>
              Our commitment doesn't end with adoption. We provide ongoing
              support, medical advice, and training resources to ensure a smooth
              transition into their new homes.
            </p>
          </div>
        </div>
      </section>

      <section className="impact-stats">
        <div className="stats-container">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Dogs Rescued</p>
          </div>
          <div className="stat-item">
            <h3>350+</h3>
            <p>Successful Adoptions</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Emergency Response</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetRescue;
