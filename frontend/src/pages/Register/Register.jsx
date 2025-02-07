import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [csrfError, setCsrfError] = useState("");

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await AxiosInstance.get("/csrf/");
        setCsrfToken(response.data.csrfToken);
        setCsrfError("");
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
        setCsrfError("Failed to fetch CSRF token. Please try again.");
      }
    };
    fetchCSRFToken();
  }, []);

  const submission = (data) => {
    setErrorMessage("");
    setCsrfError("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!csrfToken) {
      setCsrfError("CSRF token is missing. Please refresh the page.");
      return;
    }

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("full_name", data.full_name);
    formData.append("phone_number", data.phone_number);

    AxiosInstance.post("/register/", formData, {
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.detail || "Registration failed.");
        } else if (error.request) {
          setErrorMessage("No response from the server. Please try again.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      });
  };

  return (
    <div className="register-container">
      <div className="register-background"></div>

      <div className="register-content">
        <div className="register-image-section"></div>

        <div className="register-form-section">
          <h2>Register Account</h2>

          {csrfError && <div className="error-message">{csrfError}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleSubmit(submission)}>
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                {...register("full_name", { required: true })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                {...register("phone_number", { required: true })}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", { required: true })}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            <button type="submit" className="register-btn">
              Register
            </button>

            <div className="login-links">
              <p className="login-prompt">
                Already have an account? <a href="/login">Login here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;