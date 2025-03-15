import { useState } from "react";
import {
  Calendar,
  Clock,
  Stethoscope,
  PawPrint,
  Heart,
  Activity,
  AlertCircle,
  Clock3,
  CalendarCheck,
  Pill,
  Clipboard,
  DollarSign,
  X,
} from "lucide-react";
import "./appointment.css";

const Appointment = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    checkupType: "",
    petName: "",
    petBreed: "",
    petAge: "",
    petWeight: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    lastVisit: "",
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
    "Grooming Services",
    "Nutrition Consultation",
    "Laboratory Tests",
    "X-Ray and Imaging",
  ];

  const clinicServices = [
    {
      icon: <Stethoscope className="service-icon" />,
      title: "General Checkup",
      price: "₹500",
      duration: "30 mins",
    },
    {
      icon: <Pill className="service-icon" />,
      title: "Vaccination",
      price: "₹500",
      duration: "20 mins",
    },
    {
      icon: <Activity className="service-icon" />,
      title: "Surgery",
      price: "₹500 + Additional Charges",
      duration: "1-3 hours",
    },
    {
      icon: <Heart className="service-icon" />,
      title: "Emergency Care",
      price: "₹500 + Additional Charges",
      duration: "As needed",
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
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="appointment-container">
      <div className="importance-banner">
        <AlertCircle className="importance-icon" />
        <h2>Why Regular Pet Checkups Are Crucial</h2>
        <p>
          Regular veterinary checkups are essential for your pet's health and
          longevity. Early detection of health issues can save lives and reduce
          treatment costs.
        </p>
      </div>

      <div className="appointment-header">
        <h1>
          <Stethoscope className="header-icon" /> Pet Checkup Appointment
        </h1>
        <p>Schedule a comprehensive health checkup for your beloved pet</p>
        <button className="book-appointment-btn" onClick={openModal}>
          Book Appointment
        </button>
      </div>

      <div className="clinic-info">
        <h2>Our Clinic Hours</h2>
        <div className="clinic-hours">
          <div className="hours-item">
            <Clock3 className="hours-icon" />
            <span>Monday - Friday: 8:00 AM - 8:00 PM</span>
          </div>
          <div className="hours-item">
            <Clock3 className="hours-icon" />
            <span>Saturday: 9:00 AM - 6:00 PM</span>
          </div>
          <div className="hours-item">
            <Clock3 className="hours-icon" />
            <span>Sunday: 10:00 AM - 4:00 PM</span>
          </div>
        </div>
        <div className="emergency-notice">
          <AlertCircle className="emergency-icon" />
          <p>24/7 Emergency Services Available</p>
        </div>
      </div>

      <div className="services-grid">
        {clinicServices.map((service, index) => (
          <div key={index} className="service-card">
            {service.icon}
            <h3>{service.title}</h3>
            <div className="service-details">
              <p className="service-price">
                <DollarSign className="detail-icon" /> {service.price}
              </p>
              <p className="service-duration">
                <Clock className="detail-icon" /> {service.duration}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="appointment-content">
        <div className="appointment-info">
          <h2>Our Services Include</h2>
          <div className="services-list">
            <div className="service-item">
              <CalendarCheck className="service-icon" />
              <h3>Scheduled Checkups</h3>
              <p>Regular health monitoring and preventive care</p>
            </div>
            <div className="service-item">
              <Pill className="service-icon" />
              <h3>Vaccinations</h3>
              <p>Complete vaccination programs for all pets</p>
            </div>
            <div className="service-item">
              <Clipboard className="service-icon" />
              <h3>Health Certificates</h3>
              <p>Travel and regulatory documentation</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Book Your Appointment</h2>
              <button className="close-modal" onClick={closeModal}>
                <X />
              </button>
            </div>

            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Appointment Details</h3>
                <div className="form-group">
                  <label>
                    <Calendar className="form-icon" /> Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Clock className="form-icon" /> Preferred Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Stethoscope className="form-icon" /> Type of Visit
                  </label>
                  <select
                    name="checkupType"
                    value={formData.checkupType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select visit type</option>
                    {checkupTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>Pet Information</h3>
                <div className="form-group">
                  <label>
                    <PawPrint className="form-icon" /> Pet's Name
                  </label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    placeholder="Enter pet's name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Breed</label>
                    <input
                      type="text"
                      name="petBreed"
                      value={formData.petBreed}
                      onChange={handleInputChange}
                      placeholder="Pet's breed"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Age (years)</label>
                    <input
                      type="number"
                      name="petAge"
                      value={formData.petAge}
                      onChange={handleInputChange}
                      placeholder="Pet's age"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      name="petWeight"
                      value={formData.petWeight}
                      onChange={handleInputChange}
                      placeholder="Pet's weight"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Medical Information</h3>
                <div className="form-group">
                  <label>Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    placeholder="Previous conditions, surgeries, or ongoing treatments..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Current Medications</label>
                  <textarea
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    placeholder="List any current medications..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any known allergies..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Special Notes</label>
                  <textarea
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleInputChange}
                    placeholder="Any specific concerns or special instructions..."
                  ></textarea>
                </div>
              </div>

              <div className="consultation-fee">
                <DollarSign className="fee-icon" />
                <span>Doctor Consultation Fee: ₹500</span>
              </div>

              <button type="submit" className="submit-button">
                Schedule Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
