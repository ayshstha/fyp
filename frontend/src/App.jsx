import React, { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import Home from "./pages/Homepage/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Rescue from "./pages/Rescue/PetRescue";
import Appointment from "./pages/Appointments/Appointment";
import Blog from "./pages/Blog/Blog";
import Adoption from "./pages/Adoption/Adoption";
import Userprofile from "./pages/Userprofile/Userprofile";
import ProtectedRoute from "./components/protectedRoutes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("Token"));

  // Listen for token updates (Login/Logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("Token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes (Redirect logged-in users) */}
        <Route
          path="/login"
          element={
            !localStorage.getItem("Token") ? <Login /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/register"
          element={
            !localStorage.getItem("Token") ? (
              <Register />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Protected Routes (Only accessible when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/rescue" element={<Rescue />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/userprofile" element={<Userprofile />} />
          </Route>
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
