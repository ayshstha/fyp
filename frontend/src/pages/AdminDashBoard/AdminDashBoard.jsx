import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import "./AdminDashBoard.css";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Shield,
  PawPrint,
  Plus,
  MessageCircle,
  HeartHandshake,
  LogOut,
  HeartPulse
} from "lucide-react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState([]);
  const [rescueRequests, setRescueRequests] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await AxiosInstance.get("/users/");
        setUsers(usersResponse.data.filter((user) => !user.is_superuser));

        const rescueResponse = await AxiosInstance.get("/rescue-requests/");
        setRescueRequests(rescueResponse.data);

        const adoptionResponse = await AxiosInstance.get("/adoption-requests/");
        setAdoptionRequests(adoptionResponse.data);

        const appointmentsResponse = await AxiosInstance.get("/appointments/");
        setAppointments(appointmentsResponse.data);
        const donationsResponse = await AxiosInstance.get("/donations/");
        setDonations(donationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <AdminProfile
            rescueRequests={rescueRequests}
            adoptionRequests={adoptionRequests}
            vetAppointments={appointments}
            users={users}
            donations={donations}
          />
        );
      case "users":
        return <TotalUsers users={users} />;
      case "rescue":
        return <RescueRequests requests={rescueRequests} />;
      case "adoption":
        return <AdoptionRequests requests={adoptionRequests} />;
      case "add-dog":
        return <AddDog />;
      case "vet":
        return <VetAppointments appointments={appointments} />;
      case "feedback":
        return <Feedbacks />;
      case "donations":
        return <Donations />;
      default:
        return <AdminProfile />;
    }
  };

  const pendingRescueCount = rescueRequests.filter(
    (req) => req.status === "pending"
  ).length;

  const pendingAdoptionCount = adoptionRequests.filter(
    (req) => req.status === "pending"
  ).length;

  const activeAppointmentsCount = appointments.filter((appt) =>
    ["pending", "confirmed"].includes(appt.status)
  ).length;

  return (
    <div className="admin-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="admin-sidebar">
        <div className="sidebar-top">
          <button
            className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="icon" size={18} />
            Admin Profile
          </button>
          <button
            className={`sidebar-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <User className="icon" size={18} />
            Total Users ({users.length})
          </button>
          <button
            className={`sidebar-btn ${activeTab === "rescue" ? "active" : ""}`}
            onClick={() => setActiveTab("rescue")}
          >
            <Shield className="icon" size={18} />
            Rescue Management ({pendingRescueCount})
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "adoption" ? "active" : ""
            }`}
            onClick={() => setActiveTab("adoption")}
          >
            <PawPrint className="icon" size={18} />
            Adoption Management ({pendingAdoptionCount})
          </button>
          <button
            className={`sidebar-btn ${activeTab === "add-dog" ? "active" : ""}`}
            onClick={() => setActiveTab("add-dog")}
          >
            <Plus className="icon" size={18} />
            Add New Dog
          </button>
          <button
            className={`sidebar-btn ${activeTab === "vet" ? "active" : ""}`}
            onClick={() => setActiveTab("vet")}
          >
            <HeartPulse className="icon" size={18} />
            Vet Appointments ({activeAppointmentsCount})
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "feedback" ? "active" : ""
            }`}
            onClick={() => setActiveTab("feedback")}
          >
            <MessageCircle className="icon" size={18} />
            Feedbacks
          </button>
          <button
            className={`sidebar-btn ${
              activeTab === "donations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("donations")}
          >
            <HeartHandshake className="icon" size={18} />
            Donations
          </button>
        </div>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          <LogOut className="icon" size={18} />
          Logout
        </button>
      </div>
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

const AdminProfile = ({
  rescueRequests = [],
  adoptionRequests = [],
  vetAppointments = [],
  users = [],
  donations = [],
}) => {
  const totalDonations = donations.reduce(
    (total, donation) => total + Number(donation.amount),
    0
  );
  // Helper function to calculate status statistics
  const getStatusStats = (data, initialStatuses) =>
    data.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { ...initialStatuses }
    );

  // Calculate statistics
  const rescueStats = getStatusStats(rescueRequests, {
    pending: 0,
    rescued: 0,
    declined: 0,
  });

  const adoptionStats = getStatusStats(adoptionRequests, {
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const vetStats = getStatusStats(vetAppointments, {
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  // Calculate recent activity (last 7 days)
  const recentActivity = [
    ...rescueRequests.slice(0, 3).map((req) => ({
      type: "rescue",
      status: req.status,
      date: req.created_at,
      user: req.user_details?.full_name || "Anonymous",
      avatar: req.user_details?.profile_picture || "/default-avatar.png",
    })),
    ...adoptionRequests.slice(0, 3).map((req) => ({
      type: "adoption",
      status: req.status,
      date: req.created_at,
      user: req.user_details?.full_name || "Anonymous",
      avatar: req.user_details?.profile_picture || "/default-avatar.png",
    })),
    ...vetAppointments.slice(0, 3).map((appt) => ({
      type: "appointment",
      status: appt.status,
      date: appt.date,
      user: appt.user_details?.full_name || "Anonymous",
      avatar: appt.user_details?.profile_picture || "/default-avatar.png",
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // User growth data (last 6 months)
  const userGrowthData = users.reduce((acc, user) => {
    const date = new Date(user.date_joined);
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  const chartConfigs = [
    {
      title: "Rescue Status",
      data: [
        { name: "Pending", value: rescueStats.pending, color: "#ffc107" },
        { name: "Rescued", value: rescueStats.rescued, color: "#28a745" },
        { name: "Declined", value: rescueStats.declined, color: "#dc3545" },
      ],
      total: rescueRequests.length,
    },
    {
      title: "Adoption Status",
      data: [
        { name: "Pending", value: adoptionStats.pending, color: "#ffc107" },
        { name: "Approved", value: adoptionStats.approved, color: "#28a745" },
        { name: "Rejected", value: adoptionStats.rejected, color: "#dc3545" },
      ],
      total: adoptionRequests.length,
    },
    {
      title: "Vet Appointments",
      data: [
        { name: "Pending", value: vetStats.pending, color: "#ffc107" },
        { name: "Completed", value: vetStats.completed, color: "#28a745" },
        { name: "Cancelled", value: vetStats.cancelled, color: "#dc3545" },
      ],
      total: vetAppointments.length,
    },
  ];

  // Updated quick stats cards data without percentages
  const quickStats = [
    {
      title: "Total Users",
      value: users.length,
      icon: "👥",
    },
    {
      title: "Active Rescues",
      value: rescueStats.pending,
      icon: "🐕",
    },
    {
      title: "Pending Adoptions",
      value: adoptionStats.pending,
      icon: "🏠",
    },
    {
      title: "Upcoming Appointments",
      value: vetAppointments.filter((a) => new Date(a.date) > new Date())
        .length,
      icon: "🏥",
    },
    {
      title: "Total Donations",
      value: totalDonations,
      icon: "💰",
    },
  ];

  return (
    <div className="dashboard-section">
      <h2>Admin Dashboard Overview</h2>

      {/* Quick Stats Cards */}
      <div className="quick-stats-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className="quick-stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">
                {stat.title === "Total Donations"
                  ? `Rs. ${stat.value.toLocaleString()}`
                  : stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Statistics Charts */}
      <div className="stats-grid">
        {chartConfigs.map((config, index) => (
          <div key={index} className="stat-card">
            <h3>
              {config.title} (Total: {config.total})
            </h3>
            <div className="chart-container">
              <PieChart width={300} height={200}>
                <Pie
                  data={config.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {config.data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  wrapperStyle={{ paddingTop: "10px" }}
                  formatter={(value) => (
                    <span className="chart-legend">{value}</span>
                  )}
                />
              </PieChart>
            </div>
            <div className="status-breakdown">
              {config.data.map((status, idx) => (
                <div key={idx} className="status-item">
                  <span
                    className="status-color"
                    style={{ backgroundColor: status.color }}
                  ></span>
                  <span className="status-name">{status.name}</span>
                  <span className="status-count">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TotalUsers = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="dashboard-section">
      <h2>Registered Users ({users.length})</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="clear-search-btn"
          >
            Clear
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={user.profile_picture || "/default-avatar.png"}
                      alt="Profile"
                      className="user-avatar"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                  </td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">
                  {searchQuery
                    ? `No users found matching "${searchQuery}"`
                    : "No users available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages || filteredUsers.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const RescueRequests = ({ requests }) => {
  const [rescueRequests, setRescueRequests] = useState(requests);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
    sortOrder: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleStatusChange = async (id, status) => {
    try {
      await AxiosInstance.post(`/rescue-requests/${id}/update-status/`, {
        status,
      });
      setRescueRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      startDate: "",
      endDate: "",
      sortOrder: "newest",
    });
  };

  // Filter and sort requests
  // In the filteredRequests calculation:
  const filteredRequests = rescueRequests
    .filter((request) => {
      const matchesStatus =
        filters.status === "all" || request.status === filters.status;

      // Parse dates with UTC time
      const requestDate = new Date(request.created_at);
      const start = filters.startDate
        ? new Date(`${filters.startDate}T00:00:00Z`) // UTC midnight
        : null;
      const end = filters.endDate
        ? new Date(`${filters.endDate}T23:59:59.999Z`) // UTC end of day
        : null;

      const matchesDate =
        (!start || requestDate >= start) && (!end || requestDate <= end);

      return matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return filters.sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="dashboard-section">
      <h2>Rescue Management</h2>

      <div className="filters-container">
        <div className="filter-group">
          <label>Status:</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="rescued">Rescued</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="date-input"
            max={filters.endDate || new Date().toISOString().split("T")[0]}
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="date-input"
            min={filters.startDate}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {(filters.status !== "all" || filters.startDate || filters.endDate) && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-count">
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, filteredRequests.length)} of{" "}
        {filteredRequests.length} requests
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Images</th>
              <th>Location</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="user-info">
                      <img
                        src={
                          request.user_details?.profile_picture ||
                          "/default-avatar.png"
                        }
                        alt="User"
                        className="user-avatar"
                      />
                      <div>
                        <p>{request.user_details?.full_name}</p>
                        <small>{request.user_details?.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div
                      className="image-gallery-preview"
                      onClick={() => handleImageClick(request.images)}
                    >
                      {request.images?.length > 0 && (
                        <>
                          <img
                            src={request.images[0].image}
                            alt="Rescue preview"
                            className="main-preview-image"
                          />
                          {request.images.length > 1 && (
                            <div className="image-counter">
                              +{request.images.length - 1}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <a
                      href={`https://maps.google.com/?q=${request.latitude},${request.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-icon-link"
                      title="View on Google Maps"
                    >
                      <MapPin className="map-icon" />
                    </a>
                  </td>
                  <td>{request.description}</td>
                  <td>{new Date(request.created_at).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === "pending" && (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleStatusChange(request.id, "rescued")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="decline-btn"
                          onClick={() =>
                            handleStatusChange(request.id, "declined")
                          }
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No requests found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages || filteredRequests.length === 0}
        >
          Next
        </button>
      </div>

      {selectedImages.length > 0 && (
        <div className="image-modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              <X size={24} />
            </button>
            <div className="slider-container">
              <button
                className="nav-button prev"
                onClick={() =>
                  setCurrentImageIndex((i) =>
                    i > 0 ? i - 1 : selectedImages.length - 1
                  )
                }
              >
                <ChevronLeft size={32} />
              </button>

              <div className="modal-image-container">
                <img
                  src={selectedImages[currentImageIndex].image}
                  alt={`Rescue image ${currentImageIndex + 1}`}
                  className="modal-image"
                />
              </div>

              <button
                className="nav-button next"
                onClick={() =>
                  setCurrentImageIndex((i) =>
                    i < selectedImages.length - 1 ? i + 1 : 0
                  )
                }
              >
                <ChevronRight size={32} />
              </button>
            </div>

            <div className="image-indicators">
              {selectedImages.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdoptionRequests = ({ requests }) => {
  const [adoptionRequests, setAdoptionRequests] = useState(requests);
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "requestDateDesc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleStatusChange = async (id, status) => {
    try {
      await AxiosInstance.patch(`/adoption-requests/${id}/`, { status });
      setAdoptionRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      sortBy: "requestDateDesc",
    });
  };

  // Filter and sort requests
  const filteredRequests = adoptionRequests
    .filter(
      (request) => filters.status === "all" || request.status === filters.status
    )
    .sort((a, b) => {
      const requestDateA = new Date(a.created_at);
      const requestDateB = new Date(b.created_at);
      const pickupDateA = new Date(a.pickup_date);
      const pickupDateB = new Date(b.pickup_date);

      switch (filters.sortBy) {
        case "requestDateDesc":
          return requestDateB - requestDateA;
        case "requestDateAsc":
          return requestDateA - requestDateB;
        case "pickupDateDesc":
          return pickupDateB - pickupDateA;
        case "pickupDateAsc":
          return pickupDateA - pickupDateB;
        default:
          return requestDateB - requestDateA;
      }
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="dashboard-section">
      <h2>Adoption Management</h2>

      {/* Filter Controls */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Status:</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="requestDateDesc">Latest Request Date</option>
            <option value="requestDateAsc">Earliest Request Date</option>
            <option value="pickupDateDesc">Latest Pickup Date</option>
            <option value="pickupDateAsc">Earliest Pickup Date</option>
          </select>
        </div>

        {(filters.status !== "all" || filters.sortBy !== "requestDateDesc") && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-count">
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, filteredRequests.length)} of{" "}
        {filteredRequests.length} requests
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Dog</th>
              <th>Reason</th>
              <th>Request Date</th>
              <th>Pickup Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="user-info">
                      <img
                        src={
                          request.user_details?.profile_picture ||
                          "/default-avatar.png"
                        }
                        alt="User"
                        className="user-avatar"
                      />
                      <p>{request.user_details?.full_name}</p>
                    </div>
                  </td>
                  <td>
                    <div className="dog-info">
                      <img
                        src={
                          request.dog_details?.image || "/placeholder-dog.jpg"
                        }
                        alt="Dog"
                        className="dog-image"
                      />
                      <p>{request.dog_details?.name}</p>
                    </div>
                  </td>
                  <td>{request.adoption_reason}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>{new Date(request.pickup_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === "pending" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleStatusChange(request.id, "approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="decline-btn"
                          onClick={() =>
                            handleStatusChange(request.id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No requests found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages || filteredRequests.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const VetAppointments = ({ appointments }) => {
  const [vetAppointments, setVetAppointments] = useState(appointments);
  const [filters, setFilters] = useState({
    status: "all",
    sortOrder: "nearest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleStatusChange = async (id, status) => {
    try {
      await AxiosInstance.post(`/appointments/${id}/update-status/`, {
        status,
      });
      setVetAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      sortOrder: "nearest",
    });
  };

  // Filter and sort appointments
  const filteredAppointments = vetAppointments
    .filter(
      (appt) => filters.status === "all" || appt.status === filters.status
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return filters.sortOrder === "nearest" ? dateA - dateB : dateB - dateA;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <div className="dashboard-section">
      <h2>Vet Appointments</h2>

      {/* Filter Controls */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Status:</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="nearest">Nearest First</option>
            <option value="farthest">Farthest First</option>
          </select>
        </div>

        {(filters.status !== "all" || filters.sortOrder !== "nearest") && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      <div className="results-count">
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, filteredAppointments.length)} of{" "}
        {filteredAppointments.length} appointments
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Pet Info</th>
              <th>Appointment Details</th>
              <th>Medical Information</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <div className="user-info">
                      <img
                        src={
                          appt.user_details?.profile_picture ||
                          "/default-avatar.png"
                        }
                        alt="User"
                        className="user-avatar"
                      />
                      <div>
                        <p>{appt.user_details?.full_name}</p>
                        <small>{appt.user_details?.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="pet-info">
                      <p>
                        <strong>Name:</strong> {appt.pet_name}
                      </p>
                      <p>
                        <strong>Breed:</strong> {appt.pet_breed}
                      </p>
                      <p>
                        <strong>Age:</strong> {appt.pet_age} years
                      </p>
                      <p>
                        <strong>Weight:</strong> {appt.pet_weight} kg
                      </p>
                    </div>
                  </td>
                  <td>
                    <p>
                      <strong>Type:</strong> {appt.checkup_type}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appt.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {appt.time}
                    </p>
                  </td>
                  <td>
                    <div className="medical-info">
                      <p>
                        <strong>Medical History:</strong>{" "}
                        {appt.medical_history || "N/A"}
                      </p>
                      <p>
                        <strong>Medications:</strong>{" "}
                        {appt.current_medications || "N/A"}
                      </p>
                      <p>
                        <strong>Allergies:</strong> {appt.allergies || "N/A"}
                      </p>
                      <p>
                        <strong>Special Notes:</strong>{" "}
                        {appt.special_notes || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${appt.status}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {["pending", "confirmed"].includes(appt.status) && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleStatusChange(appt.id, "completed")
                          }
                        >
                          Complete
                        </button>
                        <button
                          className="decline-btn"
                          onClick={() =>
                            handleStatusChange(appt.id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No appointments found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={
            currentPage === totalPages || filteredAppointments.length === 0
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Donations.jsx
const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await AxiosInstance.get("/donations/");
        setDonations(response.data);
      } catch (error) {
        setError("Failed to fetch donation records");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = donations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(donations.length / itemsPerPage);

  if (loading) return <div className="loading">Loading donations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>Donation Records</h2>
      <div className="results-count">
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, donations.length)} of {donations.length}{" "}
        donations
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentDonations.map((donation) => (
              <tr key={donation.id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        donation.user_details?.profile_picture ||
                        "/default-avatar.png"
                      }
                      alt="Donor"
                      className="user-avatar"
                    />
                    <div>
                      <p>{donation.user_details?.full_name || "Anonymous"}</p>
                      <small>{donation.user_details?.email}</small>
                    </div>
                  </div>
                </td>
                <td>Rs. {donation.amount}</td>
                <td>{new Date(donation.donation_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages || donations.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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
      const response = await AxiosInstance.post(
        `/feedback/toggle-featured/${feedbackId}/`
      );
      setFeedbacks((prev) =>
        prev.map((feedback) =>
          feedback.id === feedbackId
            ? { ...feedback, featured: response.data.featured }
            : feedback
        )
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-section">
      <h2>User Feedbacks</h2>
      <div className="results-count">
        Showing {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, feedbacks.length)} of {feedbacks.length}{" "}
        feedbacks
      </div>
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
            {currentFeedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>
                  <img
                    src={
                      feedback.user?.profile_picture || "/default-avatar.png"
                    }
                    alt={feedback.user?.full_name || "User"}
                    className="user-avatar"
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
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages || feedbacks.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const DogList = ({ dogs, onEdit, onDelete }) => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Dog List</h2>
        <button className="add-dog-btn" onClick={() => onEdit({})}>
          <Plus size={18} /> Add New Dog
        </button>
      </div>
      {dogs.length === 0 && (
        <p className="no-dogs">No dogs available for adoption</p>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Behavior</th>
              <th>Rescue Story</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dogs.map((dog) => (
              <tr key={dog.id}>
                <td>{dog.name}</td>
                <td>
                  <img src={dog.image} alt={dog.name} className="dog-image" />
                </td>
                <td>{dog.behavior}</td>
                <td>{dog.rescue_story}</td>
                <td>
                  <button className="approve-btn" onClick={() => onEdit(dog)}>
                    Edit
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => onDelete(dog.id)}
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
    id: null,
    name: "",
    behavior: "",
    rescue_story: "",
    image: null,
  });
  const [dogs, setDogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await AxiosInstance.get("/Adoption/");
        setDogs(response.data);
      } catch (error) {
        console.error("Error fetching dogs:", error);
        toast.error("Failed to load dogs. Please try again. ❌", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    };
    fetchDogs();
  }, []);

  const handleEdit = (dog) => {
    if (dog.id) {
      setIsEditing(true);
      setFormData({
        id: dog.id,
        name: dog.name,
        behavior: dog.behavior,
        rescue_story: dog.rescue_story,
        image: null,
      });
    }
    setShowAddModal(true);
  };

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
      let response;
      if (isEditing) {
        response = await AxiosInstance.put(`/Adoption/${formData.id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("🐶 Dog updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        response = await AxiosInstance.post("/Adoption/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("🐕 Dog added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }

      const updatedDogs = await AxiosInstance.get("/Adoption/");
      setDogs(updatedDogs.data);
      setShowAddModal(false);
      setFormData({
        id: null,
        name: "",
        behavior: "",
        rescue_story: "",
        image: null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} dog:`, error);
      toast.error(
        `❌ Failed to ${isEditing ? "update" : "add"} dog. Please try again.`,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    }
  };

  const handleDelete = async (dogId) => {
    if (window.confirm("Are you sure you want to delete this dog?")) {
      try {
        await AxiosInstance.delete(`/Adoption/${dogId}/`);
        setDogs(dogs.filter((dog) => dog.id !== dogId));
        toast.success("🗑️ Dog deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } catch (error) {
        console.error("Error deleting dog:", error);
        toast.error("❌ Failed to delete dog. Please try again.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }
  };

  return (
    <div className="dashboard-section">
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-dog-modal">
            <button className="close-modal" onClick={() => setShowAddModal(false)}>
              <X size={24} />
            </button>
            <h3>{isEditing ? "Edit Dog" : "Add New Dog"}</h3>
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
                <textarea
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
                {isEditing && !formData.image && (
                  <small>Leave empty to keep existing image</small>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn submit-btn">
                  {isEditing ? "Update Dog" : "Add Dog"}
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DogList
        dogs={dogs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDashBoard;
