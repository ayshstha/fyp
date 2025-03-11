import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Stethoscope,
  PawPrint,
  FileText,
  Heart,
  Shield,
  Activity,
  AlertCircle,
} from "lucide-react";
import "./Appointment.css";

const Appointment = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    checkupType: "",
    petName: "",
    petAge: "",
    petWeight: "",
    medicalHistory: "",
    specialNotes: "",
  });

  const checkupTypes = [
    "General Health Checkup",
    "Vaccination",
    "Dental Checkup",
    "Skin Checkup",
    "Pregnancy Checkup",
    "Emergency Care",
    "Surgery Consultation",
    "Behavioral Assessment",
  ];

  const healthFacts = [
    {
      icon: <Heart className="fact-icon" />,
      title: "Regular Exercise",
      description:
        "Daily exercise helps maintain your pet's cardiovascular health and mental well-being.",
    },
    {
      icon: <Shield className="fact-icon" />,
      title: "Vaccination Schedule",
      description:
        "Keep your pet protected with timely vaccinations against common diseases.",
    },
    {
      icon: <Activity className="fact-icon" />,
      title: "Dental Health",
      description:
        "Regular dental care prevents serious health issues and extends your pet's life.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Data:", formData);
  };

  return (
    <div className="appointment-container">
      <div className="importance-banner animate-fade-in">
        <AlertCircle className="importance-icon" />
        <h2>Why Regular Pet Checkups Are Crucial</h2>
        <p>
          Regular veterinary checkups are essential for your pet's health and
          longevity. Early detection of health issues can save lives and reduce
          treatment costs.
        </p>
      </div>

      <div className="appointment-header animate-fade-in">
        <h1>
          <Stethoscope className="icon pulse" /> Pet Checkup Appointment
        </h1>
        <p>Schedule a comprehensive health checkup for your beloved pet</p>
      </div>

      <div className="appointment-content">
        <div className="appointment-info animate-slide-in">
          <h2>Benefits of Regular Checkups</h2>
          <ul>
            <li>Early detection of potential health issues</li>
            <li>Preventive care and timely vaccinations</li>
            <li>Professional dental cleaning and care</li>
            <li>Growth and development monitoring</li>
            <li>Behavioral assessment and guidance</li>
            <li>Nutritional advice and weight management</li>
            <li>Parasite prevention and control</li>
          </ul>

          <div className="appointment-image">
            <img
              src="https://images.unsplash.com/photo-1628009368231-7bb7cf0a6250?auto=format&fit=crop&w=800&q=80"
              alt="Veterinary checkup"
            />
          </div>

          <div className="health-facts-section">
            <h2>Pet Health Care Facts</h2>
            <div className="facts-container">
              {healthFacts.map((fact, index) => (
                <div key={index} className="fact-card">
                  {fact.icon}
                  <h3>{fact.title}</h3>
                  <p>{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form
          className="appointment-form animate-slide-in"
          onSubmit={handleSubmit}
        >
          <div className="datetime-group">
            <label>
              <Calendar className="icon" /> Schedule Your Visit
            </label>
            <div className="datetime-inputs">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FileText className="icon" /> Checkup Type
            </label>
            <select
              name="checkupType"
              value={formData.checkupType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a checkup type</option>
              {checkupTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <PawPrint className="icon" /> Pet Information
            </label>
            <input
              type="text"
              name="petName"
              placeholder="Pet's Name"
              value={formData.petName}
              onChange={handleInputChange}
              required
            />
            <div className="pet-details">
              <input
                type="number"
                name="petAge"
                placeholder="Age (years)"
                value={formData.petAge}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="petWeight"
                placeholder="Weight (kg)"
                value={formData.petWeight}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Medical History</label>
            <textarea
              name="medicalHistory"
              placeholder="Previous conditions, surgeries, or ongoing treatments..."
              value={formData.medicalHistory}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Special Notes</label>
            <textarea
              name="specialNotes"
              placeholder="Any specific concerns or behavioral notes..."
              value={formData.specialNotes}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
