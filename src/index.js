import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test routes that should ALWAYS work
app.get("/", (_req, res) => {
  res.json({
    message: "Perfume API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    status: "healthy"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    status: "healthy"
  });
});

app.get("/api/test", (_req, res) => {
  res.json({
    message: "Test endpoint working!",
    env: {
      hasMongo: !!process.env.MONGO_URI,
      hasJwt: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    timestamp: new Date().toISOString()
  });
});

// Try to load database routes, but don't crash if they fail
let authRoutes = null;
let productRoutes = null;
let orderRoutes = null;

// Load routes asynchronously to prevent startup crashes
Promise.all([
  import('./routes/auth.routes.js').catch(err => {
    console.warn('Failed to load auth routes:', err.message);
    return null;
  }),
  import('./routes/product.routes.js').catch(err => {
    console.warn('Failed to load product routes:', err.message);
    return null;
  }),
  import('./routes/order.routes.js').catch(err => {
    console.warn('Failed to load order routes:', err.message);
    return null;
  })
]).then(([authModule, productModule, orderModule]) => {
  if (authModule) {
    authRoutes = authModule.default;
    app.use("/api/auth", authRoutes);
    console.log('✅ Auth routes loaded successfully');
  }

  if (productModule) {
    productRoutes = productModule.default;
    app.use("/api/products", productRoutes);
    console.log('✅ Product routes loaded successfully');
  }

  if (orderModule) {
    orderRoutes = orderModule.default;
    app.use("/api/orders", orderRoutes);
    console.log('✅ Order routes loaded successfully');
  }

  console.log('🚀 All routes loaded, server ready!');
}).catch(error => {
  console.warn('⚠️ Some routes failed to load:', error.message);
});

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
