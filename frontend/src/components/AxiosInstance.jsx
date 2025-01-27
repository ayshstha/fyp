import axios from "axios";

const baseurl = "http://127.0.0.1:8000/";

const AxiosInstance = axios.create({
  baseURL: baseurl, // Fixed property name and variable reference
  timeout: 5000,
  headers: {
    "Content-Type": "application/json", // Fixed braces
    Accept: "application/json",
  },
});

console.log(AxiosInstance.defaults.baseURL);
export default AxiosInstance;
