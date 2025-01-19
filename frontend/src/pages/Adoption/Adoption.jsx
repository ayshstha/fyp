import React, { useState } from "react";
import { X, Heart, Calendar } from "lucide-react";
import "./Adoption.css";
import AdoptionComponent from "../../components/Adoption/Adoption";

const TermsAndConditions = ({ dog, onClose, onSubmit }) => {
  const [agreed, setAgreed] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleSubmit = () => {
    if (agreed && selectedDate) {
      onSubmit({ agreed, selectedDate });
    }
  };

  return (
    <div className="terms-overlay">
      <div className="terms-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="terms-content">
          <h2>Adoption Terms & Conditions</h2>
          <h3>Terms for Adopting {dog.name}</h3>

          <p className="terms-intro">
            Please read and agree to the following terms and conditions to
            proceed with the adoption request.
          </p>

          <div className="terms-list">
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>The adopter must be at least 18 years old.</p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The adopter agrees to provide a safe, secure, and pet-friendly
                home environment for the dog.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The adopter commits to caring for the dog for its lifetime,
                ensuring its well-being, safety, and happiness.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The adopter is responsible for providing appropriate food, clean
                water, and shelter at all times.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>The adopter agrees to provide regular veterinary care.</p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The dog must not be used for breeding, illegal activities, or
                any form of inhumane practice, such as dog fighting.
              </p>
            </div>
            <div className="term-item">
              <span className="checkmark">✓</span>
              <p>
                The organization reserves the right to conduct follow-up visits
                to ensure the dog's welfare.
              </p>
            </div>
          </div>

          <div className="pickup-time">
            <h3>Select Pickup Time</h3>
            <div className="calendar-wrapper">
              <Calendar className="calendar-icon" size={20} />
              <input
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          <div className="agreement-checkbox">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree">
              I have read, understood, and agree to all the terms and conditions
              listed above. I confirm that I meet all the requirements for
              adopting {dog.name}.
            </label>
          </div>

          <div className="terms-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              className={`submit-button ${
                !agreed || !selectedDate ? "disabled" : ""
              }`}
              onClick={handleSubmit}
              disabled={!agreed || !selectedDate}
            >
              Submit Adoption Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DogProfile = ({ dog, onClose }) => {
  const [showTerms, setShowTerms] = useState(false);

  const handleAdoptSubmit = (data) => {
    console.log("Adoption request submitted:", { dog, ...data });
    setShowTerms(false);
    onClose();
  };

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="profile-content">
          <div className="profile-image">
            <img src={dog.image} alt={dog.name} />
          </div>

          <div className="profile-details">
            <h2>{dog.name}</h2>

            <section>
              <h3>Rescue Story</h3>
              <p>
                {dog.rescueStory ||
                  `${dog.name} was rescued from the streets and has been 
                receiving care and love at our shelter. Through dedication and patience, 
                ${dog.name} has transformed into a loving companion ready for a forever home.`}
              </p>
            </section>

            <section>
              <h3>Behavior & Personality</h3>
              <p>
                {dog.behavior ||
                  `${dog.name} is great with children and other dogs. 
                They're house-trained, know basic commands, and love to play. 
                ${dog.name} has a friendly and energetic personality and would do 
                best in a home with a yard.`}
              </p>
            </section>

            <button className="adopt-button" onClick={() => setShowTerms(true)}>
              <Heart className="heart-icon" />
              Request to Adopt {dog.name}
            </button>
          </div>
        </div>
      </div>

      {showTerms && (
        <TermsAndConditions
          dog={dog}
          onClose={() => setShowTerms(false)}
          onSubmit={handleAdoptSubmit}
        />
      )}
    </div>
  );
};

const Adoption = () => {
  const availableDogs = [
    {
      name: "Bruno",
      image: "/dogavailable1.jpeg",
      rescueStory:
        "Bruno was found wandering the streets, hungry and scared. After weeks of rehabilitation, he's now a happy and playful companion looking for his forever family.",
      behavior:
        "Bruno is a gentle giant who loves cuddles and playing fetch. He's great with kids and other pets, making him perfect for any loving family.",
    },
    {
      name: "Khaire",
      image: "/dogavailable2.jpeg",
      rescueStory:
        "Khaire was rescued from an abandoned building. Despite his rough start, he's grown into a loving and loyal friend.",
      behavior:
        "Khaire is an intelligent and active dog who excels at training. He loves outdoor activities and would thrive in an active household.",
    },
    { name: "Tiger", image: "/dogavailable3.jpeg" },
    { name: "Golveda", image: "/dogavailable4.jpeg" },
    { name: "Sheru", image: "/dogavailable5.jpeg" },
    { name: "Prabesh", image: "/dogavailable6.jpeg" },
  ];

  const [selectedDog, setSelectedDog] = useState(null);

  return (
    <div style={{ marginTop: "80px", textAlign: "center" }}>
      <AdoptionComponent showButton={false} />
      <section className="available-dogs">
        <h2>Dogs Available for Adoption</h2>
        <div className="dogs-grid">
          {availableDogs.map((dog, index) => (
            <div key={index} className="dog-card">
              <div className="dog-image">
                <img src={dog.image} alt={dog.name} />
              </div>
              <h3>{dog.name}</h3>
              <button onClick={() => setSelectedDog(dog)} className="meet-btn">
                Meet
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedDog && (
        <DogProfile dog={selectedDog} onClose={() => setSelectedDog(null)} />
      )}

      <section className="mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            At Vet for Your Pet, we're committed to giving every stray dog a
            chance at a better life. Our team works tirelessly to rescue, heal,
            and care for dogs in need, ensuring they're ready to find loving,
            forever homes. Every dog deserves safety, love, and a family to call
            their own.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Adoption;
