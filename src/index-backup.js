import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Basic middleware - keep it simple
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// Simple logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test routes that should ALWAYS work
app.get("/", (_req, res) => {
  try {
    res.json({
      message: "Perfume API is running!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      status: "healthy"
    });
  } catch (error) {
    console.error("Root endpoint error:", error);
    res.status(500).json({ error: "Internal error", message: error.message });
  }
});

app.get("/api/health", (_req, res) => {
  try {
    res.json({
      ok: true,
      time: new Date().toISOString(),
      status: "healthy"
    });
  } catch (error) {
    console.error("Health endpoint error:", error);
    res.status(500).json({ error: "Internal error", message: error.message });
  }
});

app.get("/api/test", (_req, res) => {
  try {
    res.json({
      message: "Test endpoint working!",
      env: {
        hasMongo: !!process.env.MONGO_URI,
        hasJwt: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV || 'development'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ error: "Internal error", message: error.message });
  }
});

// Try to load routes, but don't crash if they fail
let authRoutes = null;
let productRoutes = null;
let orderRoutes = null;

try {
  // Dynamic imports to prevent startup crashes
  import('./routes/auth.routes.js').then(module => {
    authRoutes = module.default;
    console.log('Auth routes loaded successfully');
  }).catch(err => {
    console.warn('Failed to load auth routes:', err.message);
  });

  import('./routes/product.routes.js').then(module => {
    productRoutes = module.default;
    console.log('Product routes loaded successfully');
  }).catch(err => {
    console.warn('Failed to load product routes:', err.message);
  });

  import('./routes/order.routes.js').then(module => {
    orderRoutes = module.default;
    console.log('Order routes loaded successfully');
  }).catch(err => {
    console.warn('Failed to load order routes:', err.message);
  });
} catch (error) {
  console.warn('Failed to load some routes:', error.message);
}

// Add routes if they loaded successfully
if (authRoutes) {
  app.use("/api/auth", authRoutes);
}
if (productRoutes) {
  app.use("/api/products", productRoutes);
}
if (orderRoutes) {
  app.use("/api/orders", orderRoutes);
}

// Simple error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`
  });
});

// For Vercel serverless functions
export default app;

// For local development only
if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  const PORT = process.env.PORT || 4000;

  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start local server:", error);
  }
}
