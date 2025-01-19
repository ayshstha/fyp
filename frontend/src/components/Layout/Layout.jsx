import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router'
import Footer from '../Footer/Footer'
import "./Layout.css"

export const Layout = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <main>{<Outlet />}</main>
      </div>
      <Footer />
    </div>
  );
}
