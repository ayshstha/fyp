import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Heart, Camera, MapPin, FileText, AlertCircle, X } from "lucide-react";
import "./PetRescue.css";

// OpenStreetMap Component for pinning the location
const OpenStreetMapComponent = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef(null); // Ref to store map container
  const markerRef = useRef(null); // Ref to store marker

  useEffect(() => {
    // Initialize map if not already initialized
    const map = L.map(mapRef.current).setView([initialLocation.lat, initialLocation.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Initialize marker and attach to map
    markerRef.current = L.marker([initialLocation.lat, initialLocation.lng]).addTo(map);

    // Handle map click to update marker and location
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      markerRef.current.setLatLng([lat, lng]); // Move marker to new location
      onLocationSelect({ lat, lng }); // Update parent component with new location
    });

    // Cleanup map when component unmounts
    return () => {
      map.remove();
    };
  }, [initialLocation, onLocationSelect]); // Only run this effect when initialLocation or onLocationSelect change

  return (
    <div id="map-container" style={{ height: "400px", width: "100%" }} ref={mapRef}></div>
  );
};

const PetRescue = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    images: [],
    location: { lat: null, lng: null },
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
    setPreviewImages([]);
    setFormData({
      images: [],
      location: { lat: null, lng: null },
      description: "",
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.images.length === 0) {
      newErrors.images = "Please upload at least one image";
    }
    if (!formData.location.lat || !formData.location.lng) {
      newErrors.location = "Please pin a location on the map";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setFormData({
            ...formData,
            location: { lat: latitude, lng: longitude },
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching geolocation", error);
          setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // Fallback to San Francisco
          setLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // Fallback to San Francisco
      setLoadingLocation(false);
    }
  }, []);

  return (
    <div className="rescue-container">
      {/* Intro Section */}
      <section className="rescue-intro">
        <div className="intro-content">
          <h1>Give Hope to Homeless Dogs</h1>
          <p>
            Every dog deserves a chance at happiness. Our rescue mission
            transforms lives, one paw at a time.
          </p>
          <button className="rescue-btn" onClick={handleOpenModal}>
            Rescue!!!
          </button>
        </div>
      </section>

      {/* Modal Section */}
      {showModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              <X />
            </button>
            <div className="form-header">
              <Heart className="form-header-icon pulse" />
              <h2>Help Us Save a Life</h2>
              <p>Your report can make a difference in a dog's life</p>
            </div>

            <form className="rescue-form" onSubmit={handleSubmit}>
              {/* Image Upload Section */}
              <div className="form-group">
                <label>
                  <Camera className="form-icon" /> Upload Pictures
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="image-input"
                    accept="image/*"
                  />
                  <div className="upload-placeholder">
                    <Camera size={40} />
                    <p>Drag & drop images here, or click to upload</p>
                    <span>Supported formats: JPG, PNG, GIF (Max 5MB each)</span>
                  </div>
                </div>
                {previewImages.length > 0 && (
                  <div className="image-preview-grid">
                    {previewImages.map((url, index) => (
                      <div key={index} className="preview-image">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <span className="error-message">
                    <AlertCircle size={16} /> {errors.images}
                  </span>
                )}
              </div>

              {/* Location Section */}
              <div className="form-group">
                <label>
                  <MapPin className="form-icon" /> Location
                </label>
                {loadingLocation ? (
                  <div>Loading map...</div>
                ) : currentLocation ? (
                  <OpenStreetMapComponent
                    onLocationSelect={(location) =>
                      setFormData({ ...formData, location })
                    }
                    initialLocation={currentLocation}
                  />
                ) : (
                  <div>Error: Could not retrieve location</div>
                )}
                {errors.location && (
                  <span className="error-message">
                    <AlertCircle size={16} /> {errors.location}
                  </span>
                )}
              </div>

              {/* Description Section */}
              <div className="form-group">
                <label>
                  <FileText className="form-icon" /> Description
                </label>
                <textarea
                  rows="4"
                  placeholder="Please describe the dog's condition and situation in detail"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={errors.description ? "error" : ""}
                ></textarea>
                {errors.description && (
                  <span className="error-message">
                    <AlertCircle size={16} /> {errors.description}
                  </span>
                )}
              </div>

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetRescue;
