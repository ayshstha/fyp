import React, { useState } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";

import { data, useNavigate } from "react-router-dom";
import Login from "../Login/Login";

const Register = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registration submitted!");
  };

  const submission = (data) => {
    AxiosInstance.post("Register/", {
      email: data.email,
      password: data.password,
    }).then(() => {
      navigate("Login/");
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

            <form onSubmit={handleSubmit}>
              <div className="form-group image-upload">
                <div className="upload-placeholder">
                  <input type="file" id="profilePic" accept="image/*" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Enter your full name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="number">Enter your number</label>
                <input
                  type="tel"
                  id="number"
                  placeholder="Enter your number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  label={"email"}
                  name={"email"}
                  control={control}
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
                    value={password}
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
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="register-btn">
                Register
              </button>

              <p className="login-prompt">
                Already have an account? <a href="/login">Login here</a>
              </p>
            </form>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
