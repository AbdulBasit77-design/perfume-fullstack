import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Routes
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
