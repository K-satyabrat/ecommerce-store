import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.data === "development" ? "http://localhost:8000/api" : "/",
  withCredentials: true,
});
