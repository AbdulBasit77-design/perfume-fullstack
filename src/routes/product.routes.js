import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  upload, // multer middleware
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);

// Admin CRUD with image upload
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
