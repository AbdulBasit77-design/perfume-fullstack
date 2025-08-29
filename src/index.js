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

// Simple test routes that don't require database
app.get("/", (_req, res) => {
  res.json({
    message: "Perfume API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.get("/api/test", (_req, res) => {
  res.json({
    message: "Test endpoint working!",
    env: {
      hasMongo: !!process.env.MONGO_URI,
      hasJwt: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Routes that require database
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// For Vercel serverless functions
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;

  // Only connect to DB in local development
  if (process.env.MONGO_URI) {
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
  } else {
    console.log("MONGO_URI not set, starting without database connection");
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  }
}
