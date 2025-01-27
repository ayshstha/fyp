import React, { useState, useEffect } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../components/AxiosInstance.jsx"; // Assuming AxiosInstance is set up for your API
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, register } = useForm();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null); // State to store CSRF token

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await AxiosInstance.get('/csrf/'); // Request CSRF token from backend
        setCsrfToken(response.data.csrfToken); // Store CSRF token in state
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
        alert("Failed to fetch CSRF token.");
      }
    };
    fetchCSRFToken();
  }, []);

  // Handle form submission
  const submission = (data) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!csrfToken) {
      alert("CSRF token is missing.");
      return;
    }

    // Make POST request to register user with CSRF token in headers
    AxiosInstance.post(
      "/register/",  // Ensure this is the correct API endpoint
      {
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          "X-CSRFToken": csrfToken,  // Add CSRF token to the request headers
        },
      }
    )
      .then(() => {
        navigate("/"); // Redirect to home page after successful registration
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error Response:", error.response.data);
          alert(error.response.data.detail || "Registration failed.");
        } else if (error.request) {
          console.log("No response received:", error.request);
          alert("No response from the server.");
        } else {
          console.log("Error message:", error.message);
          alert("An unexpected error occurred.");
        }
      });
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(submission)}>
        <div className="register-background"></div>

        <div className="register-content">
          <div className="register-image-section"></div>

          <div className="register-form-section">
            <h2>Register</h2>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                label={"email"}
                name={"email"}
                {...register("email")}
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name={"password"}
                  {...register("password")}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  name={"confirmPassword"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>

            <p className="login-prompt">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
