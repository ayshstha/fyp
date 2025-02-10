import React, { useState, useEffect } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css"; // Import CSS file

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("UserRole"); // Get user role

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
    if (userRole === "Admin") {
      switch (activeTab) {
        case "admin-dashboard":
          return <AdminDashboard />;
        default:
          return <AdminDashboard />;
      }
    } else {
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
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="sidebar">
        {userRole === "Admin" ? (
          <>
            <button
              className={`sidebar-btn ${
                activeTab === "admin-dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("admin-dashboard")}
            >
              📊 Admin Dashboard
            </button>
          </>
        ) : (
          <>
            <button
              className={`sidebar-btn ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              👤 User Profile
            </button>
            <button
              className={`sidebar-btn ${
                activeTab === "adoption" ? "active" : ""
              }`}
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
              className={`sidebar-btn ${
                activeTab === "password" ? "active" : ""
              }`}
              onClick={() => setActiveTab("password")}
            >
              🔒 Change Password
            </button>
          </>
        )}
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

// Placeholder Admin Dashboard Component
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AxiosInstance.get("/users/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>All Registered Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/home")}>Back to Home</button>
    </div>
  );
};

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

const ChangePassword = () => (
  <div className="section-container">
    <h2>Change Password</h2>
    <p>Change your password securely.</p>
  </div>
);

export default UserProfile;
