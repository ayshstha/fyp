import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import "./AdminDashBoard.css";

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState([]);
  const [rescueRequests, setRescueRequests] = useState([]);
  const navigate = useNavigate();
  const [adoptionRequests, setAdoptionRequests] = useState([]);

  useEffect(() => {
    // Fetch initial data
    AxiosInstance.get("/users/")
      .then((response) => {
        // Filter out superusers 
        const normalUsers = response.data.filter((user) => !user.is_superuser);
        setUsers(normalUsers);
      })
      .catch(console.error);

    AxiosInstance.get("/rescue-requests/")
      .then((response) => setRescueRequests(response.data))
      .catch(console.error);
  }, []);

  

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <AdminProfile />;
      case "users":
        return <TotalUsers users={users} />;
      case "rescue":
        return <RescueRequests requests={rescueRequests} />;
      case "adoption":
        return <AdoptionRequests requests={adoptionRequests} />;
      case "add-dog":
        return <AddDog />;
      case "vet":
        return <VetAppointments />;
      case "feedback":
        return <Feedbacks />;
      case "donations":
        return <Donations />;
      default:
        return <AdminProfile />;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-top">
          <button
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Admin Profile
          </button>
          <button
            className={`sidebar-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Total Users ({users.length})
          </button>
          <button
            className={`sidebar-btn ${activeTab === "rescue" ? "active" : ""}`}
            onClick={() => setActiveTab("rescue")}
          >
            🐶 Rescue Requests ({rescueRequests.length})
          </button>
          <button
            className={`sidebar-btn ${activeTab === "adoption" ? "active" : ""}`}
            onClick={() => setActiveTab("adoption")}
          >
            🐾 Adoption Requests ({adoptionRequests.length})
          </button>
          <button
            className={`sidebar-btn ${activeTab === "add-dog" ? "active" : ""}`}
            onClick={() => setActiveTab("add-dog")}
          >
            ➕ Add New Dog
          </button>
          <button
            className={`sidebar-btn ${activeTab === "vet" ? "active" : ""}`}
            onClick={() => setActiveTab("vet")}
          >
            🏥 Vet Appointments
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "feedback" ? "active" : ""
            }`}
            onClick={() => setActiveTab("feedback")}
          >
            💬 Feedbacks
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "donations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("donations")}
          >
            💰 Donations
          </button>
        </div>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

// Example Component (Add others similarly)
const TotalUsers = ({ users }) => (
  <div className="dashboard-section">
    <h2>Registered Users</h2>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <img
                  src={user.profile_picture || "/default-avatar.png"}
                  alt="Profile"
                  width="50"
                  height="50"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DogList = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await AxiosInstance.get("/Adoption/");
        setDogs(response.data);
      } catch (error) {
        setError("Failed to fetch dogs.");
        console.error("Error fetching dogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  const handleDelete = async (dogId) => {
    try {
      await AxiosInstance.delete(`/Adoption/${dogId}/`);
      setDogs(dogs.filter((dog) => dog.id !== dogId)); // Remove the deleted dog from the list
      alert("Dog deleted successfully!");
    } catch (error) {
      console.error("Error deleting dog:", error);
      alert("Failed to delete dog. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>Dog List</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Behavior</th>
              <th>Rescue Story</th>
              <th>Image</th>
              <th>Action</th> {/* New column for the delete button */}
            </tr>
          </thead>
          <tbody>
            {dogs.map((dog) => (
              <tr key={dog.id}>
                <td>{dog.id}</td>
                <td>{dog.name}</td>
                <td>{dog.behavior}</td>
                <td>{dog.rescue_story}</td>
                <td>
                  <img src={dog.image} alt={dog.name} width="50" height="50" />
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(dog.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddDog = () => {
  const [formData, setFormData] = useState({
    name: "",
    behavior: "",
    rescue_story: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("behavior", formData.behavior);
    data.append("rescue_story", formData.rescue_story);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await AxiosInstance.post("/Adoption/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Dog added successfully!");
      setFormData({
        name: "",
        behavior: "",
        rescue_story: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding dog:", error);
      alert("Failed to add dog. Please try again.");
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Add New Dog</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Dog Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Behavior and Personality</label>
          <input
            type="text"
            value={formData.behavior}
            onChange={(e) =>
              setFormData({ ...formData, behavior: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Rescue Story</label>
          <input
            type="text"
            value={formData.rescue_story}
            onChange={(e) =>
              setFormData({ ...formData, rescue_story: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Dog
        </button>
      </form>

      {/* Include the DogList component below the form */}
      <DogList />
    </div>
  );
};

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await AxiosInstance.get("/admin/profile/");
        setAdminData(response.data);
      } catch (error) {
        setError("Failed to fetch admin profile.");
        console.error("Error fetching admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>Admin Profile</h2>
      <div className="profile-details">
        <div className="detail-item">
          <label>Full Name</label>
          <p>{adminData?.full_name || "N/A"}</p>
        </div>
        <div className="detail-item">
          <label>Email</label>
          <p>{adminData?.email || "N/A"}</p>
        </div>
        <div className="detail-item">
          <label>Phone Number</label>
          <p>{adminData?.phone_number || "N/A"}</p>
        </div>
        <div className="detail-item">
          <label>Role</label>
          <p>Admin</p>
        </div>
      </div>
    </div>
  );
};

const RescueRequests = ({ requests }) => (
  <div className="dashboard-section">
    <h2>Rescue Requests</h2>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Location</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.user}</td>
              <td>{request.location}</td>
              <td>{request.status}</td>
              <td>{new Date(request.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await AxiosInstance.get("/adoption-requests/");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching adoption requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, status) => {
    try {
      await AxiosInstance.patch(`/adoption-requests/${requestId}/`, { status });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status } : req
        )
      );
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Adoption Requests ({requests.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Dog</th>
              <th>Pickup Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        request.user.profile_picture || "/default-avatar.png"
                      }
                      alt={request.user.full_name}
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div>
                      <p>{request.user.full_name}</p>
                      <p>{request.user.phone_number}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dog-info">
                    <img
                      src={request.dog.image}
                      alt={request.dog.name}
                      width="50"
                      height="50"
                    />
                    <p>{request.dog.name}</p>
                  </div>
                </td>
                <td>{new Date(request.pickup_date).toLocaleString()}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "accepted")
                        }
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "declined")
                        }
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VetAppointments = () => (
  <div className="dashboard-section">
    <h2>Vet Appointments</h2>
    <p>List of upcoming vet appointments will appear here.</p>
  </div>
);


const Donations = () => (
  <div className="dashboard-section">
    <h2>Donations</h2>
    <p>Donation records will appear here.</p>
  </div>
);

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await AxiosInstance.get("/feedback/");
        setFeedbacks(response.data);
      } catch (error) {
        setError("Failed to fetch feedbacks.");
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const toggleFeatured = async (feedbackId) => {
    try {
      const response = await AxiosInstance.post(`/feedback/toggle-featured/${feedbackId}/`);
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === feedbackId ? { ...feedback, featured: response.data.featured } : feedback
      ));
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>User Feedbacks</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User Image</th>
              <th>User Name</th>
              <th>Message</th>
              <th>Date</th>
              <th>Featured</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>
                  <img
                    src={
                      feedback.user?.profile_picture || "/default-avatar.png"
                    }
                    alt={feedback.user?.full_name || "User"}
                    width="50"
                    height="50"
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </td>
                <td>{feedback.user?.full_name || "Anonymous User"}</td>
                <td>{feedback.message}</td>
                <td>
                  {feedback.created_at
                    ? new Date(feedback.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{feedback.featured ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="feature-btn"
                    onClick={() => toggleFeatured(feedback.id)}
                  >
                    {feedback.featured ? "Unfeature" : "Feature"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashBoard;
