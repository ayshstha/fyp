import React, { useState, useEffect } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import "./UserProfile.css"; // Import CSS file

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AxiosInstance.get("/user/profile/");
        if (response?.data) {
          setUser(response.data);
        } else {
          setError("User data not found.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data.");
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const getProfilePicture = () => {
    return user?.profile_picture || "https://via.placeholder.com/150";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <UserProfileDetails
            user={user}
            getProfilePicture={getProfilePicture}
          />
        );
      case "adoption":
        return <AdoptionHistory />;
      case "vet":
        return <VetHistory />;
      case "edit":
        return <EditProfile user={user} />; 
      case "password":
        return <ChangePassword />;
      default:
        return (
          <UserProfileDetails
            user={user}
            getProfilePicture={getProfilePicture}
          />
        );
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="sidebar">
       
        <button
          className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 User Profile
        </button>
        <button
          className={`sidebar-btn ${activeTab === "adoption" ? "active" : ""}`}
          onClick={() => setActiveTab("adoption")}
        >
          🐾 Adoption History
        </button>
        <button
          className={`sidebar-btn ${activeTab === "vet" ? "active" : ""}`}
          onClick={() => setActiveTab("vet")}
        >
          🏥 Vet History
        </button>
        <button
          className={`sidebar-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          ✏️ Edit Profile
        </button>
        <button
          className={`sidebar-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          🔒 Change Password
        </button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

// Placeholder components for different sections
const UserProfileDetails = ({ user, getProfilePicture }) => (
  <div className="profile-info">
    <div className="profile-header">
      <div className="profile-photo-container">
        <img
          src={getProfilePicture()}
          alt="Profile"
          className="profile-photo"
        />
      </div>
    </div>
    <div className="profile-details">
      <div className="detail-item">
        <label>Full Name</label>
        <p>{user?.name || "N/A"}</p>
      </div>
      <div className="detail-item">
        <label>Email</label>
        <p>{user?.email || "N/A"}</p>
      </div>
      <div className="detail-item">
        <label>Phone</label>
        <p>{user?.phone || "N/A"}</p>
      </div>
    </div>
  </div>
);

const AdoptionHistory = () => (
  <div className="section-container">
    <h2>Adoption History</h2>
    <p>Your adoption history will appear here.</p>
  </div>
);

const VetHistory = () => (
  <div className="section-container">
    <h2>Vet Appointments</h2>
    <p>Your veterinary history will appear here.</p>
  </div>
);

const EditProfile = ({ user }) => {
  const [fullName, setFullName] = useState(user?.name || ""); // Use `name` instead of `full_name`
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || ""); // Use `phone` instead of `phone_number`
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profile_picture || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone_number", phone);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const response = await AxiosInstance.post(
        "/user/edit-profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        setError("");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.error || "Failed to update profile.");
      setSuccess("");
    }
  };

  return (
    <div className="section-container">
      <h2>Edit Profile</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="profile-preview"
            />
          )}
        </div>
        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const response = await AxiosInstance.post("/user/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.status === 200) {
        setSuccess("Password changed successfully!");
        setError("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError(
        error.response?.data?.error ||
          "Failed to change password. Please check your current password."
      );
      setSuccess("");
    }
  };

  return (
    <div className="section-container">
      <h2>Change Password</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
