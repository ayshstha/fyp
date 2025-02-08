// userprofile.jsx
import React, { useState, useEffect } from "react";
import AxiosInstance from "../../components/AxiosInstance"; // Your Axios instance to make API requests

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null); // State to store the logged-in user data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to store error message

  // Fetch the logged-in user details (you can modify the endpoint according to your API)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AxiosInstance.get("/user/profile/"); // Adjust to your new endpoint
        console.log("API Response:", response); // Log the entire response to debug

        if (response && response.data) {
          setUser(response.data); // Store the user data in state
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

  // If loading, display a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // Make sure user is not null before rendering
  return (
    <div className="profile-container">
      <div className="sidebar">
        <button
          className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          User Profile
        </button>
        {/* Add other tabs as needed */}
      </div>
      <div className="content">
        <div className="profile-info">
          <div className="profile-header">
            <div className="profile-photo-container">
              {/* Display profile picture */}
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <div className="profile-photo default-avatar">
                  {user?.name ? getInitials(user.name) : "N/A"}
                </div>
              )}
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <label>Full Name</label>
              <p>{user?.name || "N/A"}</p> {/* Fallback if name is not present */}
            </div>
            <div className="detail-item">
              <label>Email</label>
              <p>{user?.email || "N/A"}</p> {/* Fallback if email is not present */}
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <p>{user?.phone || "N/A"}</p> {/* Fallback if phone is not present */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
