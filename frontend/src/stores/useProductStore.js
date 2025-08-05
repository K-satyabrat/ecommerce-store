import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.post(
        "/products/createProduct",
        productData
      );
      set((prevState) => ({
        products: [...prevState.products, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  fetchAllProducts: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/products/getAllProducts");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  fetchProductByCategory: async (category) => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message);
    }
  },

  deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axiosInstance.delete(`/products/delete/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(
        `/products/togglefeatureProduct/${productId}`
      );

      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },

 fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axiosInstance.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));
