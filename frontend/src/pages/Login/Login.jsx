import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const submission = (data, event) => {
    if (event) event.preventDefault(); // Prevent default form submission

    AxiosInstance.post("login/", {
      email: data.email,
      password: data.password,
    })
      .then((response) => {
        localStorage.setItem("Token", response.data.token);
        localStorage.setItem("UserRole", response.data.user.role);

        toast.success("Login successful! Redirecting...", {
          autoClose: 2000,
          onClose: () => {
            if (response.data.user.role === "Admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/home");
            }
          },
        });
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Please check your credentials and try again."
        );
        console.error("Login error:", error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="login-content">
        <div className="login-image-section"></div>

        <div className="login-form-section">
          <h2>Login Account</h2>

          <form
            onSubmit={(e) => handleSubmit((data) => submission(data, e))(e)}
          >
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
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
                  name="password"
                  {...register("password", { required: true })}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <div className="login-links">
              <a href="/register" className="register-link">
                Don't have an account?
              </a>
              <a href="/request/password_reset" className="forgot-link">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
