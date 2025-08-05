import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  addToCart: async (product) => {
    try {
      await axiosInstance.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      if (backendMsg === "Unauthorized - No access token provided") {
        toast.error("Please login first");
      } else {
        toast.error(backendMsg || "An error occurred");
      }
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    console.log("Calculating totals:", { subtotal, coupon });

    if (coupon && coupon.discountPercentage) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
      console.log("Applied discount:", { discount, total });
    }

    set({ subtotal, total });
  },

  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      toast.success("Product removed from cart");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    await axiosInstance.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },

  clearCart: () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
  },

  getMyCoupon: async () => {
		try {
			const response = await axiosInstance.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axiosInstance.post("/coupons/validate", { code });
			console.log("Coupon validation response:", response.data);
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},

  removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},
}));
