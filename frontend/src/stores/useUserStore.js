import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signUp: async (name, email, password, confirmPassword) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      console.log("Password doesn't match");
      return toast.error("Password doesn't match");
    }

    try {
      // Make API call to sign up
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      // console.log(res.data)
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message || "An error occured, please try again"
      );
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      // Make API call to login
      const res = await axiosInstance.post("/auth/login", { email, password });
      // console.log(res)
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message || "An error occured, please try again"
      );
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successful");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/profile");
      // console.log("checkAuth response:", response.data);
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
     if (error.response?.status !== 401) {
      console.log(error.message);
    }
      set({ checkingAuth: false, user: null });
    }
  },
}));
