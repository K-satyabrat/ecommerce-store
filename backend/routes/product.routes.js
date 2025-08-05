import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getFeaturedProducts,
  getProducts,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/getAllProducts", protectRoute, adminRoute, getProducts);
router.get("/featured-product", getFeaturedProducts);
router.post("/createProduct", protectRoute, adminRoute, createProduct);
router.delete("/delete/:id", protectRoute, adminRoute, deleteProduct);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.patch( "/togglefeatureProduct/:id", protectRoute,adminRoute, toggleFeaturedProduct
);

export default router;
