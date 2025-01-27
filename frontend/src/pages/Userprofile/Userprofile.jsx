import React, { useState } from "react";
import "./UserProfile.css";
import { User, Calendar, PawPrint, Lock, Edit } from "lucide-react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Sample user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-info">
            <div className="profile-header">
              <div className="profile-photo-container">
                <div className="profile-photo default-avatar">
                  {getInitials(user.name)}
                </div>
                <button className="edit-photo-btn">
                  <Edit size={16} />
                </button>
              </div>
              <h2>{user.name}</h2>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <label>Full Name</label>
                <p>{user.name}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <p>{user.phone}</p>
              </div>
            </div>
          </div>
        );
      case "appointments":
        return <div className="tab-content">Appointment History</div>;
      case "adoptions":
        return <div className="tab-content">Adoption History</div>;
      case "password":
        return <div className="tab-content">Change Password</div>;
      default:
        return <div className="tab-content">Select a tab</div>;
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <button
          className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={20} />
          User Profile
        </button>
        <button
          className={`sidebar-btn ${
            activeTab === "appointments" ? "active" : ""
          }`}
          onClick={() => setActiveTab("appointments")}
        >
          <Calendar size={20} />
          Appointment History
        </button>
        <button
          className={`sidebar-btn ${activeTab === "adoptions" ? "active" : ""}`}
          onClick={() => setActiveTab("adoptions")}
        >
          <PawPrint size={20} />
          Adoption History
        </button>
        <button
          className={`sidebar-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          <Lock size={20} />
          Change Password
        </button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default UserProfile;
