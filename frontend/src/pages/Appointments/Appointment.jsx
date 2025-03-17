import { useState } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import {
  Calendar,
  Clock,
  Stethoscope,
  PawPrint,
  AlertCircle,
  Clock3,
  CalendarCheck,
  Pill,
  Clipboard,
  DollarSign,
  X,
  Heart,
  CheckCircle,
  Activity, // Add this import
} from "lucide-react";
import "./appointment.css";

const Appointment = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      icon: <Activity className="service-icon" />, // Now using the imported Activity icon
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

  // Open and close modal functions
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({}); // Clear errors when closing the modal
  };

  // Frontend validation
  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    const selectedDate = new Date(formData.date);

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else if (selectedDate < currentDate) {
      newErrors.date = "Date cannot be in the past";
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    // Pet information validation
    if (!formData.petName.trim()) {
      newErrors.petName = "Pet name is required";
    }
    if (!formData.petBreed.trim()) {
      newErrors.petBreed = "Pet breed is required";
    }
    if (!formData.petAge) {
      newErrors.petAge = "Pet age is required";
    } else if (formData.petAge < 0) {
      newErrors.petAge = "Age cannot be negative";
    }
    if (!formData.petWeight) {
      newErrors.petWeight = "Pet weight is required";
    } else if (formData.petWeight <= 0) {
      newErrors.petWeight = "Weight must be positive";
    }

    // Checkup type validation
    if (!formData.checkupType) {
      newErrors.checkupType = "Please select a checkup type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await AxiosInstance.post("/appointments/", {
        date: formData.date,
        time: formData.time,
        checkup_type: formData.checkupType,
        pet_name: formData.petName,
        pet_breed: formData.petBreed,
        pet_age: parseInt(formData.petAge),
        pet_weight: parseFloat(formData.petWeight),
        medical_history: formData.medicalHistory,
        current_medications: formData.currentMedications,
        allergies: formData.allergies,
        special_notes: formData.specialNotes,
      });

      if (response.status === 201) {
        setShowConfirmation(true);
        setShowModal(false);
        setFormData({
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
          specialNotes: "",
        });
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrors({
        general:
          error.response?.data?.detail ||
          "Failed to book appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation modal component
  const ConfirmationModal = () => (
    <div className="confirmation-overlay">
      <div className="confirmation-content">
        <CheckCircle className="confirmation-icon" size={48} />
        <h2>Appointment Booked Successfully!</h2>
        <p>Your veterinary appointment has been scheduled.</p>
        <button
          className="confirm-ok-btn"
          onClick={() => setShowConfirmation(false)}
        >
          OK
        </button>
      </div>
    </div>
  );

  return (
    <div className="appointment-container">
      {/* Confirmation Modal */}
      {showConfirmation && <ConfirmationModal />}

      {/* Error Banner */}
      {errors.general && (
        <div className="error-banner">
          <AlertCircle className="error-icon" />
          <p>{errors.general}</p>
          <button onClick={() => setErrors({})} className="close-error">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Importance Banner */}
      <div className="importance-banner">
        <AlertCircle className="importance-icon" />
        <h2>Why Regular Pet Checkups Are Crucial</h2>
        <p>
          Regular veterinary checkups are essential for your pet's health and
          longevity. Early detection of health issues can save lives and reduce
          treatment costs.
        </p>
      </div>

      {/* Appointment Header */}
      <div className="appointment-header">
        <h1>
          <Stethoscope className="header-icon" /> Pet Checkup Appointment
        </h1>
        <p>Schedule a comprehensive health checkup for your beloved pet</p>
        <button className="book-appointment-btn" onClick={openModal}>
          Book Appointment
        </button>
      </div>

      {/* Clinic Info */}
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

      {/* Services Grid */}
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

      {/* Appointment Content */}
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

      {/* Appointment Form Modal */}
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
              {/* Appointment Details */}
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
                    className={errors.date ? "error-input" : ""}
                  />
                  {errors.date && (
                    <span className="error-message">{errors.date}</span>
                  )}
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
                    className={errors.time ? "error-input" : ""}
                  />
                  {errors.time && (
                    <span className="error-message">{errors.time}</span>
                  )}
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
                    className={errors.checkupType ? "error-input" : ""}
                  >
                    <option value="">Select visit type</option>
                    {checkupTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.checkupType && (
                    <span className="error-message">{errors.checkupType}</span>
                  )}
                </div>
              </div>

              {/* Pet Information */}
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
                    className={errors.petName ? "error-input" : ""}
                  />
                  {errors.petName && (
                    <span className="error-message">{errors.petName}</span>
                  )}
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
                      className={errors.petBreed ? "error-input" : ""}
                    />
                    {errors.petBreed && (
                      <span className="error-message">{errors.petBreed}</span>
                    )}
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
                      className={errors.petAge ? "error-input" : ""}
                    />
                    {errors.petAge && (
                      <span className="error-message">{errors.petAge}</span>
                    )}
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
                      className={errors.petWeight ? "error-input" : ""}
                    />
                    {errors.petWeight && (
                      <span className="error-message">{errors.petWeight}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
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

              {/* Consultation Fee */}
              <div className="consultation-fee">
                <DollarSign className="fee-icon" />
                <span>Doctor Consultation Fee: ₹500</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
