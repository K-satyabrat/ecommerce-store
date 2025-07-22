import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import { getProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getProducts);

export default router;
