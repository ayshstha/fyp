import { Layout } from "./components/Layout/Layout";
import Home from "./pages/Homepage/Home";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Rescue from "./pages/Rescue/PetRescue";
import Appointment from "./pages/Appointments/Appointment";
import Blog from "./pages/Blog/Blog";
import Adoption from "./pages/Adoption/Adoption";
import Userprofile from "./pages/Userprofile/Userprofile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rescue" element={<Rescue />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/appointments" element={<Appointment />} />
      <Route path="/adoption" element={<Adoption />} />
      <Route path="/userprofile" element={<Userprofile />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
