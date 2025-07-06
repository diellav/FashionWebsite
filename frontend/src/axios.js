import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  
});
const publicPaths = ["/login","/register"];
axiosInstance.interceptors.request.use(
  (config) => {
    if (!publicPaths.some(path => config.url.includes(path))) {
      const token = localStorage.getItem("token");
      console.log("API Base URL:", process.env.REACT_APP_API_URL);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      

      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
